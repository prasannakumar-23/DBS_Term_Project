Comprehensive e-commerce platform(with the emphasis on the backend) designed to offer a complete online shopping experience for both users and sellers. Beyond the standard e-commerce functionalities, a key differentiating aspect of this platform is the integration of an **external, simulated banking system**. This 'Bank Feature' serves as a critical component for validating the consistency, robustness, and transactional integrity of the entire e-commerce ecosystem, simulating real-world financial flows.

The platform facilitates the entire purchase lifecycle, from user registration and product Browse to order placement, tracking, and returns, ensuring a realistic and secure transaction environment.

### Core E-commerce Features Implemented:

* **User & Seller Management:**
    * **Registration:** Separate registration flows for new users and sellers.
    * **Login:** Secure authentication for both user and seller accounts.
    * **OTP Verification:** One-Time Password (OTP) implementation for enhanced user security during critical actions (e.g., login, certain transactions).
* **Product Lifecycle:**
    * **Product Upload (Seller):** Sellers can easily add new products to the catalog with relevant details.
    * **Product Display (User):** Users can view product listings with details and images.
    * **Product Search:** Efficient search functionality for users based on product name and category.
* **Shopping & Order Management (User):**
    * **Cart Management:** Users can add/remove products from their shopping cart.
    * **Order Placing:** Streamlined process for users to confirm and place orders.
    * **Orders Placed:** Users can view a history and status of their past orders.
    * **Order Tracking:** Users can monitor the real-time status of their placed orders.
* **Post-Purchase & Returns:**
    * **Return Feature (User):** Users can initiate return requests for purchased products.
    * **Accept/Reject Return (Seller):** Sellers have the functionality to review and approve or decline return requests.
* **Seller Dashboard:** A dedicated interface for sellers to manage their products, view orders, and handle returns.
* **Platform Monetization:**
    * **Commission System:** Implemented logic for the e-commerce platform to deduct a commission on successful sales.

### Unique Feature: Integrated Bank Simulation

To rigorously test the consistency and robustness of the e-commerce platform's transactional logic, an independent, **simulated banking system** was developed. This feature acts as an external financial service that the e-commerce platform interacts with for all monetary operations.

**Key Bank Feature Implementations:**

* **Bank Creation:** APIs to establish new simulated banking institutions.
* **Account Creation:** Users can create bank accounts within these simulated banks.
* **Account Linking:** During e-commerce account creation, users are required to link their simulated bank account number.
* **Account Details:** APIs to fetch account balance and other details.
* **Deposit Money:** Functionality to simulate depositing funds into bank accounts.
* **Transfer Money:** APIs to simulate money transfers between accounts.

**Consistency & Robustness Validation:**

* **Transaction Validation:** During order placement, the e-commerce platform queries the bank system to verify if the user's linked account has sufficient funds. Orders are declined if the balance is insufficient.
* **Refund Management:** For product returns, the system ensures that the correct refund amount is credited back to the user's bank account through secure API calls to the simulated bank.
* **Real-world Simulation:** This setup mimics real-world payment gateways and banking interactions, allowing for comprehensive testing of edge cases related to balance checks, successful transactions, failed transactions, and refunds, ensuring the e-commerce platform's financial integrity.

Final Demo:
https://drive.google.com/drive/folders/1Oo76uVNRB75xvNZtCkj8__bbWEhsdsO9?usp=drive_link