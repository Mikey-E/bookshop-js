# bookshop-js

A simple book store API in need of input validation/sanitization.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:

- [Go](https://github.com/andey-robins/bookshop-go)
- [Rust](https://github.com/andey-robins/bookshop-rs)

## Versioning

`bookshop-js` is built with:

- node version v16.19.0
- npm version 9.6.2
- nvm version 0.39.3

## Usage

Start the api using `npm run dev`

I recommend using [`httpie`](https://httpie.io) for testing of HTTP endpoints on the terminal. Tutorials are available elsewhere online, and you're free to use whatever tools you deem appropriate for testing your code.

## Analysis of Existing Code (Security Write-Up)

### Privacy Design

Privacy is not a core feature of this design. There is no direct way to query customer names and addresses, though this is
still possible for an attacker to do without much hassle, as described in *Damage Potential*.

### Potential for Non-Security Related Abuse

There is little to no potential for the software to abuse other entities in the real world *if* the software is used as intended i.e. its vulnerabilities are not exploited.

### Unintended Consequences

Considering the purpose of the software, it is unlikely to cause unintended consequences if security vulnerabiltiies are not exploited.

### Confidentiality

There is an extreme lack of confidentiality. All users have access to the same API and therefore all the same data.
Names, shipping addresses, and orders of customers are potentially vulnerable.

### Integrity

There is an extreme lack of data integrity. Anyone can update customer addresses, even addresses other than their own.

Recommendeded action:
- Cryptographic authentication and authoriziation. (beyond the scope of this assignment)

### Availability

The system has high availability with the same API being accessible to everyone with no authentication or authorization
required (possible misgivings about that notwithstanding).

### Authentication

There is no authentication. (beyond the scope of this assignment)

### Authorization

There is no authorization. (beyond the scope of this assignment)

### Auditability

There is no auditability. There are no logs implemented at this time.

Recommendeded action:
- Logging utilities to create logs. This can be done by creating a function to open a file and append a line of text, or
by using a logging library.

### Assets

The main asset here is the database, which should be assigned a value of "high" because it contains sensitive customer
information. There is little protection of this information, high potential for leaks, and likely legal consequences
for the bookstore if a leak occurs.

Recommended action:
- Encrypt the contents of the database with a strong algorithim such as AES before storing and retrieving that data.
- Cryptographic authentication and authoriziation. (beyond the scope of this assignment)

### Attack Surfaces

The API is the main attack surface, which is exposed to everyone. The database is also vulnerable to insider attacks, as well
as SQL injection.

Recommended action:
- Encrypt the contents of the database with a strong algorithim such as AES before storing and retrieving that data.
- Sanitize API input to prevent SQL injection and other mischief.

### Trust boundaries

A trust boundary exists at the API; everything outside it is untrusted, and everything connected to it on the inside is
trusted.

### STRIDE threat categories

#### Spoofing

There is no potential for phishing / stolen password threats given the lack of a username/password paradigm. However, there
is the possibility of impersonation as a form of tampering. Replay attacks are also a possibility. Even with encrypted
traffic, replay attackers can cause multiple orders for a customer just by resending the data.

Recommendeded action:
- Cryptographic authentication and authoriziation. (beyond the scope of this assignment)

#### Tampering

Tampering is possible. Not only is there nothing to prevent tampering from either customers or employees, but there is no
logging to allow for investigating any tampering that has been done.

Recommendeded action:
- Cryptographic authentication and authoriziation. (beyond the scope of this assignment)
- Logging utilities to create logs. This can be done by creating a function to open a file and append a line of text, or
by using a logging library.
- After cryptographic authentication and authorization, create HMACs for database contents.

#### Repudation

Repudiation is possible. Without logs and authentication, there is plausibile deniability for any changes to the state of
database, both by legitimate users and malicious users.

Recommendeded action:
- Cryptographic authentication and authoriziation. (beyond the scope of this assignment)
- Logging utilities to create logs. Ensure destruction of logs is not possible.

#### Information Disclosure

Information leaks are easily possible. It's unclear if any side channel attacks are possible, but with the current way the
system is, there would be no reason to perform such an attack when the data is readily available to anyone. Encryption is
not present.

Recommended action:
- Encrypt the contents of the database with a strong algorithim such as AES before storing and retrieving that data.

#### Denial of Service

Various kinds of denial of service are potentially possible. Simultaneous requests are no more or less possible to any other
web endpoint. Though with no limits or accountability for who is making requests, the database can be drained of its free
resources such as memory.

Recommendeded action:
- Cryptographic authentication and authoriziation. (beyond the scope of this assignment)

#### Elevation of Privelege

With no authentication and authorization, this is not an issue. (However it could become an issue after authentication and
authorization are implemented)

### DREAD Considerations (overall)

#### Damage potential

There is huge potential for damage. Sensitive customer data (like addresses) can easily be read by anyone from the
/orders/status endpoint by incrementing through the cid and bid variables.
If it happens, there are no logs to determine who did this.

Recommended action:
- Encrypt the contents of the database with a strong algorithim such as AES before storing and retrieving that data.
- Logging utilities to create logs. This can be done by creating a function to open a file and append a line of text, or
by using a logging library.
- (optionally) Do not autoincrement primary keys in the databases. Whether or not to avoid this depends on the
implementations of other recommended actions.

#### Reproducibility

Attacks are likely to succeed all the time.

#### Exploitability

The vulnerabilities are easily exploitable; there are few constraints on user behavior.

Recommended action:
- Sanitize API input to prevent SQL injection and other mischief.

#### Affected Users

The affected users could consist of some, all, or a few. Specific targets could be attacked. For example, addresses could be
obtained the same way as described under the *Damage Potential* section

#### Discoverability

The likelihood that attackers will find these vulnerabilities is very high.

### Miscellaneous

getOrderStatus() is vulnerable to HTML injection (XSS) in addition to SQL injection.

Recommended action:
- Sanitize API input to prevent HTML injection.

There is no way to delete data thru the API. For now this can be ignored.

There is no way to some data values e.g. book prices. It is assumed that if this functionality is missing, then that implies
the value is purposely immutable.

## Changes to the Code

Not all recommended actions are implemented, only those asked for in the assignment are.

### Input Sanitization Strategy

#### Numbers

- Range of datatype: no negative prices or account balances are allowed.
- Precision of floats: in the case of the price and account balance, floats must be limited to 2 decimal places (the cents).
- Ensuring all characters are numeric will prevent SQL injection from numbers.

#### Strings

- No names or authors may be over 100 bytes long.
- No titles may be over 500 bytes long.
- Special characters that could be used for SQL/HTML injection are disallowed.

#### Rejection Feedback to User

The response will contain notification of the input rule that was broken. This constitutes explanation of valid input.

As per the instructions, erroneous input will not be corrected, the user will have to try again.

### db/customers.ts

- chargeCustomerForPO() implemented.
- (bugfix) give user an account balance. (not yet implemented)

### db/purchaseOrders.ts

- shipPo should have uppercase O (not yet implemented)
- shipPO should have a check on customer balance before shipping (not yet implemented)
