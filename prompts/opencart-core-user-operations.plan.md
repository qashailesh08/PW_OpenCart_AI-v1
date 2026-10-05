# OpenCart Core User Operations Test Plan

## Application Overview

Five independent end-user scenarios for the OpenCart demo storefront at https://naveenautomationlabs.com/opencart/: account sign-in, product discovery, product details and wishlist, cart management, and checkout. Exploration confirmed a customer account dashboard, category navigation, product search with category/subcategory/description and sort/limit controls, featured product cards with wishlist/cart actions, and cart quantity/coupon/gift-certificate controls. The inspected MacBook and iPhone product records showed Out Of Stock, and attempting checkout with the exploratory cart item returned to the cart with a stock warning. Each test starts from a blank browser session with an empty cart and wishlist; use authorized demo account credentials without placing real payment details or sharing credentials in test artifacts.

## Test Scenarios

### 1. Core E-commerce User Operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in to the customer account and handle invalid credentials

**File:** `tests/account-sign-in.spec.ts`

**Steps:**
  1. Start in a fresh, logged-out browser context at the storefront; ensure there is no prior cart or wishlist state. Open My Account > Login.
    - expect: The Account Login page is shown with E-Mail Address and Password fields, a Forgotten Password link, and a registration Continue link.
  2. Submit an invalid email/password combination.
    - expect: The page remains unauthenticated and displays a clear login failure message without exposing the password.
  3. Replace the values with the authorized demo account credentials supplied for this task and submit.
    - expect: The customer is authenticated and redirected to My Account.
  4. Inspect the account dashboard links.
    - expect: Account information, address book, wish list, and order history are available; signed-in state is reflected in the account controls.

#### 1.2. Browse categories and search the catalog

**File:** `tests/product-discovery.spec.ts`

**Steps:**
  1. Start a fresh session on the storefront and browse a top-level product category, then open a subcategory where available.
    - expect: The category page title and product listing match the selected category, and visible product cards show their name, price, and shopping actions.
  2. Search for “MacBook” using the header search field and submit.
    - expect: Search results include matching products such as MacBook, MacBook Air, and MacBook Pro.
  3. On the results page, refine search using a category and the subcategory/description controls, and change sort order and result limit.
    - expect: The selected filters are applied and reflected in the results/URL; sorting and limit changes update the listing without losing the query.
  4. Search for a deliberately nonexistent product name.
    - expect: A clear no-results state is shown; unrelated products are not presented as matches.

#### 1.3. Inspect product details and manage the wishlist

**File:** `tests/product-details-wishlist.spec.ts`

**Steps:**
  1. Start fresh and open a configurable product detail page, such as Apple Cinema 30\".
    - expect: The product name, price, description/reviews, quantity input, and available options are shown.
  2. Attempt to add the product without selecting any required option, then select valid option values and set quantity to 1.
    - expect: If a required option is missing, an actionable validation message is displayed and no invalid item is added. With valid options, the selected values remain visible and the requested quantity is accepted.
  3. Add a product to the wishlist using the product card or detail-page wishlist action; open My Account > Wish List.
    - expect: A success notice is shown and the selected product appears in the wishlist with its model, stock status, price, and available actions.
  4. Remove the product from the wishlist.
    - expect: The product is removed; when no products remain, the wishlist displays its empty-state message.

#### 1.4. Manage cart quantities and validate stock and discounts

**File:** `tests/cart-management.spec.ts`

**Steps:**
  1. Start fresh with an empty cart; select a known in-stock product fixture, set a valid quantity, and add it to the cart.
    - expect: A success notice is shown and the cart count updates. The cart contains the correct product, model, quantity, unit price, and total.
  2. Change the cart quantity to a larger valid positive integer and update the cart.
    - expect: The updated quantity and line total are reflected; subtotal, tax, and total recalculate consistently.
  3. Try a zero, negative, nonnumeric, or over-available quantity.
    - expect: Invalid quantities are rejected or normalized according to the storefront rules, and the cart does not display a false successful total.
  4. Apply an invalid coupon and an invalid gift certificate using their respective cart controls.
    - expect: Each application gives a clear failure message and does not incorrectly reduce the total.
  5. Add a known out-of-stock product (the explored MacBook and iPhone records are marked Out Of Stock) and inspect the cart and checkout action.
    - expect: The cart clearly marks the item unavailable (the observed cart uses an *** marker and an out-of-stock warning), and checkout is blocked or redirected to the cart rather than silently accepting the unavailable item.
  6. Remove all cart items and reopen the cart.
    - expect: The cart displays “Your shopping cart is empty!” and no stale quantities or totals remain.

#### 1.5. Complete checkout for an in-stock cart item

**File:** `tests/checkout-order.spec.ts`

**Steps:**
  1. Start fresh and use an explicitly in-stock test product fixture; add one item to the cart and select Checkout. Do not use the observed out-of-stock MacBook or iPhone records for the successful path.
    - expect: Checkout opens for a non-empty, purchasable cart. If the fixture becomes unavailable, the test must stop at the stock warning and report the environment prerequisite rather than passing.
  2. Proceed through the checkout flow using the authorized signed-in customer, verify billing/delivery information, select an available shipping method and payment method, and accept any required terms.
    - expect: Each checkout step accepts valid required information, preserves the cart contents, and presents validation for missing or invalid mandatory fields.
  3. Review the order summary and confirm the order using only approved demo checkout data; do not enter real payment credentials.
    - expect: The confirmation page indicates successful order placement, shows the correct product, quantity, and total, and the order appears in account order history.
  4. Return to the cart after successful checkout.
    - expect: The purchased cart is cleared, and the order remains visible in order history.
