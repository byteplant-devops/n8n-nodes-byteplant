<p align="center">
  <img src="https://www.byteplant.com/img/logo.png" alt="Byteplant" width="400">
</p>

<h1 align="center">n8n-nodes-byteplant</h1>

<p align="center">
  Validate email addresses, phone numbers and postal addresses in your <a href="https://n8n.io/">n8n</a> workflows,<br>
  with unparalleled precision in 240+ countries worldwide.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-byteplant"><img src="https://img.shields.io/npm/v/n8n-nodes-byteplant" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-byteplant"><img src="https://img.shields.io/npm/dm/n8n-nodes-byteplant" alt="npm downloads"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/npm/l/n8n-nodes-byteplant" alt="License"></a>
</p>

<p align="center">
  <a href="#installation">Installation</a> ·
  <a href="#operations">Operations</a> ·
  <a href="#credentials">Credentials</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#compatibility">Compatibility</a> ·
  <a href="#resources">Resources</a>
</p>

---

This is an n8n community node. It adds a single **Byteplant** node that connects to the Byteplant validation APIs. It runs once for every input item, and AI Agent nodes can use it as a tool.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

> **Upgrading from 0.1.x?** Version 0.2.0 replaces the three separate nodes (Byteplant Address Validator, Email Validator and Phone Validator) with one **Byteplant** node. Your existing credentials keep working. In your workflows, replace each old node with the Byteplant node and select the matching resource.

## Installation

1. In n8n, go to **Settings → Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-byteplant` and confirm.

For more options, such as installing on a self-hosted instance from the command line, see the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Operations

| Resource | Operation | What it does |
| --- | --- | --- |
| **Address Validator** | Validate | Validates and standardizes a postal address, with optional geocoding |
| **Email Validator** | Validate | Checks whether an email address is deliverable and detects freemail providers |
| **Phone Validator** | Validate | Validates a phone number in express or extensive mode |

## Credentials

Each resource uses its own API key. Sign up for the service you need to get one:

| Credential | Used by | Get an API key |
| --- | --- | --- |
| Byteplant Address Validator API | Address Validator | [Byteplant account](https://www.byteplant.com/address-validator/api.html) |
| Byteplant Email Validator API | Email Validator | [Byteplant account](https://www.byteplant.com/email-validator/api.html) |
| Byteplant Phone Validator API | Phone Validator | [Byteplant account](https://www.byteplant.com/phone-validator/api.html) |

In n8n, create the credential and paste your API key. The node sends the key as a query parameter with every request. If you save a key that is invalid or has no credits left, the credential test fails.

## Usage

Every resource has a **Timeout** field, which sets how long the API may take to respond: 5–300 seconds, 10 by default.

### Address Validator - [API Docs](https://www.byteplant.com/address-validator/api.html)

| Field | Required | Description |
| --- | :---: | --- |
| Country Code | ✅ | Two-letter ISO 3166-1 country code. Use `XX` for international addresses. |
| Street Address | ✅ | Street, house number and building. May include the unit or apartment. |
| City | | City or locality |
| Additional Address Info | | Building, unit, apartment or floor |
| Postal Code | | ZIP or postal code |
| State | | State or province |
| Street Number | | House or building number, if it isn't part of Street Address |
| Geocoding | | Whether to return coordinates for the address. Off by default. |
| Locale | | Output language for countries with more than one postal language. Use it only to translate addresses, and leave it empty for address validation. |
| Output Charset | | `utf-8` (default) or `us-ascii` |

#### Output

| Field | Description |
| --- | --- |
| `status` | `VALID`: the address is correct and deliverable. `SUSPECT`: the address needs corrections to be deliverable, and a suggested correction is provided. `INVALID`: the address is not deliverable and can't be corrected automatically. Other values: `DELAYED`, `NO_COUNTRY`, `RATE_LIMIT_EXCEEDED`, `RESTRICTED`, `INTERNAL_ERROR` |
| `formattedaddress` | Full address in standardized format |
| `supplement` | Additional address details (building, unit, apartment, suite) |
| `street` | Street in standardized format |
| `streetnumber` | Street number in standardized format |
| `postalcode` | ZIP or postal code in standardized format |
| `city` | City in standardized format |
| `district` | District in standardized format |
| `county` | County in standardized format |
| `state` | State or province in standardized format |
| `country` | Two-letter ISO 3166-1 country code |
| `type` | Address type: `S` for a street address, `P` for a P.O. box, pick-up or other delivery service |
| `rdi` | Residential Delivery Indicator: commercial or residential |
| `diagnostics` | Hints about errors in the address input. See the [full list of diagnostic hints](https://www.byteplant.com/address-validator/validation-diagnostic-hints.html). |
| `corrections` | Hints about which parts of the address input were fixed. See the [full list of correction hints](https://www.byteplant.com/address-validator/validation-diagnostic-hints.html). |
| `latitude`, `longitude` | Coordinates. Only returned for valid addresses when **Geocoding** is on. |

### Email Validator - [API Docs](https://www.byteplant.com/email-validator/api.html)

| Field | Required | Description |
| --- | :---: | --- |
| Email Address | ✅ | The email address to validate |

#### Output

| Field | Description |
| --- | --- |
| `status` | Numeric result code, e.g. `200` for a valid address. See the [full list of result codes](https://www.byteplant.com/email-validator/validation-results.html). |
| `info` | [Short status description](https://www.byteplant.com/email-validator/validation-results.html) |
| `details` | [Full status description](https://www.byteplant.com/email-validator/validation-results.html) |
| `freemail` | `true` if the address belongs to a freemail provider (Gmail, Yahoo, Outlook/Hotmail/Live, AOL, …) |
| `category` | Added by the node: `valid`, `invalid`, `suspect` or `indeterminate`, based on `status`. Use it to route items with an **If** or **Switch** node. |

### Phone Validator - [API Docs](https://www.byteplant.com/phone-validator/api.html)

| Field | Required | Description |
| --- | :---: | --- |
| Phone Number | ✅ | The phone number to validate, in national format or in international format with a leading `+` |
| Country Code | | Two-letter ISO 3166-1 country code. Optional if the phone number is in international format. |
| Locale | | IETF language tag for geocoding results. Defaults to `en-US`. |
| Mode | | **Extensive** (default) runs full validation. **Express** runs static checks only and is faster. |

#### Output

| Field | Description |
| --- | --- |
| `status` | `VALID_CONFIRMED`, `VALID_UNCONFIRMED`, `INVALID`, `DELAYED` or `RATE_LIMIT_EXCEEDED` |
| `linetype` | `FIXED_LINE`, `MOBILE`, `VOIP`, `TOLL_FREE`, `PREMIUM_RATE`, `SHARED_COST`, `PERSONAL_NUMBER`, `PAGER`, `UAN` or `VOICEMAIL` |
| `location` | Geographical location (city, county, state) |
| `countrycode` | Two-letter ISO 3166-1 country code |
| `formatnational` | Phone number in national format |
| `formatinternational` | Phone number in international format |
| `mcc` | Mobile country code, which identifies the mobile network operator (carrier) |
| `mnc` | Mobile network code, which identifies the mobile network operator (carrier) |

## Compatibility

| Requirement | Version |
| --- | --- |
| n8n | 1.0.0 or later |
| Node.js | 20.15 or later |

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Address Validator API documentation](https://www.byteplant.com/address-validator/api.html)
- [Email Validator API documentation](https://www.byteplant.com/email-validator/api.html)
- [Phone Validator API documentation](https://www.byteplant.com/phone-validator/api.html)
- [Byteplant website](https://www.byteplant.com/)

## License

[MIT](LICENSE.md)
