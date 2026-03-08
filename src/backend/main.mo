import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor {
  // Include storage system
  include MixinStorage();

  // Include authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Core Types
  public type Id = Text;
  public type UserId = Id;
  public type Tag = Text;

  public type UserProfile = {
    id : UserId;
    name : Text;
    // extend as needed
  };

  public type Product = {
    id : Id;
    priceCents : Nat;
  };

  public type ShoppingList = {
    id : Id;
    name : Text;
    owner : UserId;
    products : [Product];
    sharedWith : [UserId];
    categories : [Tag];
  };

  public type ShoppingListTag = {
    id : Id;
    name : Text;
    color : Text;
  };

  public type ProductCategory = {
    id : Id;
    name : Text;
    description : Text;
    parent : ?Id;
  };

  public type ProductFamilyTree = {
    id : Id;
    name : Text;
    categories : [ProductCategory];
    relatedFamilies : [Id];
  };

  // State
  var nextId = 1;
  var productCounter = 1;

  let shoppingLists = Map.empty<Id, ShoppingList>();
  let shoppingListTags = Map.empty<Id, ShoppingListTag>();
  let categories = Map.empty<Id, ProductCategory>();
  let products = Map.empty<Id, Product>();
  let productFamilies = Map.empty<Id, ProductFamilyTree>();

  // Stripe Integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // Helper Functions
  func generateId(prefix : Text) : Text {
    let id = prefix # nextId.toText();
    nextId += 1;
    id;
  };

  func generateProductId() : Text {
    let id = "product" # productCounter.toText();
    productCounter += 1;
    id;
  };

  public query func getStripeConfiguration() : async Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  // Stripe Queries
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  // Shopping List management
  public shared ({ caller }) func createShoppingList(name : Text, owner : UserId, categories : [Tag]) : async Id {
    let listId = generateId("list");
    let list : ShoppingList = {
      id = listId;
      name;
      owner;
      products = [];
      sharedWith = [];
      categories;
    };
    shoppingLists.add(listId, list);
    listId;
  };

  // Product management
  public shared ({ caller }) func addProductToList(listId : Id, productPriceCents : Nat) : async Id {
    let productId = generateProductId();
    let product : Product = {
      id = productId;
      priceCents = productPriceCents;
    };
    products.add(productId, product);

    switch (shoppingLists.get(listId)) {
      case (null) { Runtime.trap("Shopping list does not exist") };
      case (?list) {
        let updatedProducts = list.products.concat([product]);
        let updatedList = {
          id = list.id;
          name = list.name;
          owner = list.owner;
          products = updatedProducts;
          sharedWith = list.sharedWith;
          categories = list.categories;
        };
        shoppingLists.add(listId, updatedList);
      };
    };
    productId;
  };

  // End of Actor
};
