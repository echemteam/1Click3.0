import React from "react";
import "./TermsAndConditionsPage.scss";
import Link from "next/link";
const navItems = [
  { label: "Definitions and interpretation", href: "#definitions" },
  { label: "These Terms", href: "#theseTerms" },
  { label: "Contracts", href: "#contracts" },
  { label: "Delivery", href: "#delivery" },
  { label: "Title", href: "#title" },
  {
    label: "Customers acknowledgements and obligations",
    href: "#customersAcknowledgements",
  },
  { label: "Prices and payment", href: "#pricesAndPayment" },
  { label: "Warranties and indemnity", href: "#warrantiesAndIndemnity" },
  { label: "Inspection and returns", href: "#inspection" },
  { label: "Product Liability Claims", href: "#productLiability" },
  { label: " IPR disclaimer", href: "#IPR" },
  { label: "Limitations and exclusions of liability", href: "#limitations" },

  { label: "Force majeure", href: "#forceMajeure" },
  { label: "Contract term and termination", href: "#contractTermination" },
  { label: "Effects of termination", href: "#effectsTermination" },
  { label: "Scope of these terms of sale and supply", href: "#scopeThese" },
  { label: "Notices", href: "#notices" },
  { label: "General", href: "#general" },
];
const TermsConditionsPage = () => {
  return (
    <div className="terms-conditions-page">
      <div className="terms-conditions-content">
        <div className="left-point-sec">
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="side-navigation-link">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="right-desc-sec">
          <div className="right-desc-content">
            <span className="title-text">Terms & Conditions</span>
            <div className="desc-text">
              <p>
                Please read these Terms carefully, as they set out our and your
                legal rights and obligations in relation to the Products and
                servers that we provide. If you purchase Products on our website
                from 1Click, Inc, we will ask for your express agreement to
                these Terms. If you purchase from another seller, these Terms do
                not apply.
              </p>
              <p>
                We will not file a copy of these Terms specifically in relation
                to you, and they may not be accessible on our Website in future.
                You should therefore print a copy of these Terms for future
                reference.
              </p>
              <p>
                We will not file a copy of these Terms specifically in relation
                to you, and they may not be accessible on our Website in future.
                You should therefore print a copy of these Terms for future
                reference.
              </p>
            </div>
            <span className="title-text" id="definitions">
              1. Definitions and interpretation
            </span>
            <div className="desc-text">
              <p>1.1 In these Terms:</p>
              <p>
                <b>&quot;Contract&quot;</b> means a contract between 1Click, Inc
                and the Customer for the sale and supply of Products entered
                into in accordance with Clause 3;
              </p>
              <p>
                <b>&quot;Customer&quot;</b> means the customer for the Products
                identified on the online order form or purchase order or other
                order form submitted to 1Click, Inc.
              </p>
              <p>
                <b>&quot;Force Majeure Event&quot;</b> means an event, or a
                series of related events, that is outside the reasonable control
                of the party affected (including power failures, strikes or
                other industrial disputes affecting any third party, changes to
                the law, embargos or other governmental regulations or actions,
                disasters, accidents, explosions, fires, floods, storms,
                lightning, riots, vandalism, theft, terrorist attacks and wars);
              </p>
              <p>
                <b>&quot;Intellectual Property Rights&quot;</b> means all
                intellectual property rights wherever in the world, whether
                registrable or unregistrable, registered or unregistered,
                including any application or right of application for such
                rights (and the &quot;intellectual property rights&quot;
                referred to above include copyright and related rights, moral
                rights, database rights, confidential information, trade
                secrets, know-how, business names, trade names, domain names,
                trade marks, service marks, passing off rights, unfair
                competition rights, patents, petty patents, utility models,
                semi-conductor topography rights and rights in designs);
              </p>
              <p>
                1Click, Inc., an incorporated company established under the law
                of NJ, USA having its principal place of business at PO BOX
                1638, Allen, TX 75013,USA.
              </p>
              <p>
                <b>&quot;Product Liability Claim&quot;</b> means any claim,
                dispute and/or proceedings resulting from or arising in
                connection with any death, personal injury or damage to property
                caused in whole or part by the Products;
              </p>
              <p>
                <b>&quot;Products&quot;</b> means the products that are or may
                be purchased by the Customer from 1Click, Inc. under these
                Terms, namely chemical compounds for use in laboratory research
                projects; and &quot;Terms&quot; means these terms of sale and
                supply
              </p>
              <p>
                1.2 In these Terms, a reference to a statute or statutory
                provision includes a reference to:
              </p>
              <ul>
                <li>
                  (a) that statute or statutory provision as modified,
                  consolidated and/or re-enacted from time to time; and
                </li>
                <li>
                  (b) any subordinate legislation made under that statute or
                  statutory provision.
                </li>
              </ul>
              <p>
                1.3 The Clause headings do not affect the interpretation of
                these Terms.
              </p>
              <p>
                1.4 In these Terms, &quot;persons&quot; include companies,
                partnerships, limited liability partnerships, unincorporated
                associations and trusts.
              </p>
            </div>
            <span className="title-text" id="theseTerms">
              2. These Terms
            </span>
            <div className="desc-text">
              <p>
                2.1 These Terms contain the only conditions upon which 1Click,
                Inc. will deal with the Customer, and they govern all Contracts
                to the exclusion of all other terms and conditions.
              </p>
              <p>
                2.2 Without prejudice to Clause 2.1, any reference to any of the
                Customer&apos;s terms and conditions in any document forming
                part of or evidencing a Contract will not have the effect of
                incorporating any such terms and conditions into the Contract,
                nor of forming any other contract between the parties for the
                purchase of the Products.
              </p>
            </div>
            <span className="title-text" id="contracts">
              3. Contracts
            </span>
            <div className="desc-text">
              <p>
                3.1 The advertising of Products on www.1Click.net and any
                quotation given by 1Click, Inc. for the supply of Products,
                constitutes an &quot;invitation to treat&quot; and not a
                contractual offer.
              </p>
              <p>
                3.2 No contract will come into force between 1Click, Inc. and
                the Customer for the sale and supply of Products except in
                accordance with this Clause 3.
              </p>
              <p>
                3.3 There are two distinct procedures for entering into
                Contracts with 1Click, Inc. for the sale and supply of Products:
              </p>
              <ul>
                <li>
                  (a) Contracts may be entered into using the shopping cart and
                  checkout procedure on www.1Click, Inc..com detailed in Clause
                  3.4; or
                </li>
                <li>
                  (b) Contracts may be entered into using the quotation
                  procedure detailed in Clause 3.5.
                </li>
              </ul>
              <p>
                3.4 In order to enter into a Contract to purchase products from
                1Click, Inc. using the shopping cart and checkout procedure, the
                Customer will need to take the following steps:
              </p>
              <ul>
                <li>
                  (a) the Customer must add the products the Customer wishes to
                  purchase to the shopping cart, and then proceed to the
                  checkout;
                </li>
                <li>
                  (b) if the Customer is a new customer, the Customer may then
                  create an account with 1Click, Inc. and log in; if the
                  Customer is an existing customer, the Customer may enter its
                  login details; Customers may also proceed to make a purchase
                  without registering;
                </li>
                <li>
                  (c) the Customer must next select the preferred method of
                  delivery and confirm the order and the Customer&apos;s consent
                  to these terms of sale and supply;
                </li>
                <li>
                  (d) unless the Customer is a 1Click, Inc. account holder and
                  opts to pay using its account, the Customer will be
                  transferred to the website of 1Click, Inc.&apos;s payment
                  services provider, who will process the Customer&apos;s
                  payment; the Customer must also send to 1Click, Inc. using the
                  website contact form details of any specific version of a
                  Product that may be required, such as specific salt form,
                  stereo or nuclear isomer, and details of any specific
                  packaging required;
                </li>
                <li>
                  (e) 1Click, Inc. will next send to the Customer an initial
                  acknowledgement (including confirmation of the price of the
                  relevant Products);
                </li>
                <li>
                  (f) once 1Click, Inc. has checked whether it is able to meet
                  the order, 1Click, Inc. will either send to the Customer an
                  order confirmation (at which point the order will become a
                  binding Contract) or 1Click, Inc. will confirm by email that
                  it is unable to meet the order; and
                </li>
                <li>
                  (g) before an order is placed, the Customer will have the
                  opportunity of identifying whether any input errors have been
                  made, and or correcting such input errors.
                </li>
              </ul>
              <p>
                3.5 This Clause 3.5 sets out the procedure by which a Contract
                may be entered into between 1Click, Inc. and the Customer where
                1Click, Inc. issues a quotation to the Customer:
              </p>
              <ul>
                <li>
                  (a) in order to request a quotation for the supply of
                  Products, the Customer must: (i) identify the Products
                  required using the website search and browse facilities; and
                  (ii) contact 1Click, Inc. to request a quotation, providing
                  full details of the Products required (including details of
                  any specific version of a Product that may be required, such
                  as specific salt form, stereo or nuclear isomer, and details
                  of any specific packaging required), the address for delivery,
                  and any specific date for delivery;
                </li>
                <li>
                  (b) 1Click, Inc. may then provide a written quotation to the
                  Customer, which will be valid for 30 days or such other period
                  as 1Click, Inc. may specify in the quotation;
                </li>
                <li>
                  (c) the Customer may indicate that the terms of the quotation
                  are acceptable by giving to 1Click, Inc. written notice that
                  that is the case (for the purposes of contract law, this shall
                  be deemed to be an offer by the Customer to 1Click, Inc. to
                  enter into the Contract); and
                </li>
                <li>
                  (d) a Contract between 1Click, Inc. and the Customer for the
                  sale and purchase of the relevant Products will come into
                  force (unless 1Click, Inc. and the Customer expressly agree
                  otherwise) if and only if 1Click, Inc.: (i) notifies the
                  Customer that the order will be fulfilled; and (ii) receives
                  in cleared funds from the Customer all amounts due in respect
                  of the Products (unless the Customer has a 1Click, Inc.
                  account, in which case the Contract will come into force when
                  1Click, Inc. notfies the Customer that the order will be
                  fulfilled).
                </li>
              </ul>
              <p>
                3.6 1Click, Inc. may cancel a Contract insofar as it relates to
                particular Products, by giving to the Customer written notice of
                cancellation at any time before delivery of those Products, if:
              </p>
              <ul>
                <li>
                  (a) a Force Majeure Event prevents the sourcing or delivery of
                  the Products; or
                </li>
                <li>
                  (b) the Products in question are or become out of stock, in
                  which cases any amounts paid to 1Click, Inc. under the
                  Contract will (at the option of the Customer) be refunded to
                  the Customer or a credit note will be issued to the Customer.
                </li>
              </ul>
              <p>3.7 1Click, Inc. may increase and otherwise amend:</p>
              <ul>
                <li>(a) the price of Products under a Contract; and/or</li>
                <li>
                  (b) the other charges and costs payable under a Contract, by
                  giving to the Customer written notice of the increase at any
                  time before the shipping of those Products, if there is a
                  material increase in the cost to 1Click, Inc. of obtaining the
                  Products or of paying the other charges and costs, providing
                  that any increase under this Clause must not exceed the amount
                  of the increase in cost to 1Click, Inc..
                </li>
              </ul>
              <p></p>
            </div>
            <span className="title-text" id="delivery">
              4. Delivery
            </span>
            <div className="desc-text">
              <p>4.1 Unless otherwise agreed in writing:</p>
              <ul>
                <li>
                  (a) all Products will be delivered to the address specified by
                  the Customer.
                </li>
                <li>
                  (b) 1Click, Inc. will be responsible for arranging loading,
                  carriage, transport, unloading and for clearing the Products
                  for export.
                </li>
                <li>
                  (c) 1Click, Inc. will be responsible for paying all costs
                  relating to loading, carriage, transport, unloading and export
                  of the Products (subject to reimbursement in accordance with
                  Clause 7); and
                </li>
                <li>
                  (d) risk in the Products will pass from 1Click, Inc. to the
                  Customer when the Products are dispatched to the Customer
                  (whether dispatched by 1Click, Inc. or by a third party).
                </li>
              </ul>
              <p>
                4.2 Unless otherwise agreed in writing, the Customer will be
                responsible for clearing the Products for import into the
                destination jurisdiction, and for paying (directly to the
                relevant authorities) any applicable import taxes and duties.
              </p>
              <p>
                4.3 If the parties agree, or if Product availability means that
                a single delivery is in 1Click, Inc.&apos;s opinion impractical
                or undesirable, the delivery of the Products under a Contract
                will be by installments. In these circumstances, each
                installment will constitute part of a single Contract, and not
                separate contracts. A delay in the delivery of any part of a
                Contract&apos;s Products will not relieve the Customer of its
                obligation to accept each delivery.
              </p>
              <p>
                4.4 1Click, Inc. shall aim to delivery Products to the Customer
                on or around the estimated delivery date or dates specified by
                1Click, Inc. during the checkout process or quotation process,
                but does not guarantee that the Products will be delivered on
                that date or those dates.
              </p>
            </div>
            <span className="title-text" id="title">
              5. Title
            </span>
            <div className="desc-text">
              <p>
                5.1 Legal and equitable title to the Products will pass from
                1Click, Inc. to the Customer upon the later of:
              </p>
              <ul>
                <li>(a) delivery of the Products; and</li>
                <li>
                  (b) receipt by 1Click, Inc. of all amounts due from the
                  Customer to 1Click, Inc. under the relevant Contract.
                </li>
              </ul>
              <p>5.2 Until title to the Products has passed to the Customer:</p>
              <ul>
                <li>
                  (a) the Customer will hold the Products as fiduciary agent and
                  bailed of 1Click, Inc.;
                </li>
                <li>
                  (b) the Customer will: (i) store the Products at its own
                  premises in a secure, safe, dry and clean environment
                  separately from other products and goods; (ii) ensure that the
                  Products are easily identifiable as belonging to 1Click, Inc.;
                  (iii) not deface, destroy, alter or obscure any identifying
                  mark on the Products or their packaging; (iv) ensure that no
                  charge, lien or other encumbrance is created over the
                  Products; and (v) deliver up the Products to 1Click, Inc. upon
                  demand.
                </li>
              </ul>
              <p>
                5.3 1Click, Inc. may bring an action for the price of Products,
                and any other amounts due under a Contract, notwithstanding that
                title to the Products has not passed to Customer.
              </p>
            </div>
            <span className="title-text" id="customersAcknowledgements">
              6. Customers acknowledgements and obligations
            </span>
            <div className="desc-text">
              <p>
                6.1 The Customer acknowledges that the Products may be
                hazardous, and undertakes to properly and fully investigate and
                verify such hazards before purchasing Products and also before
                using the Products for any particular purpose.
              </p>
              <p>
                6.2 The Customer acknowledges that the Products are intended
                primarily for laboratory use and, unless otherwise indicated by
                1Click, Inc., must not be used for other purposes, including as,
                or as or a component in, any food, drug, or medical device
                (including in vitro diagnostic reagents), cosmetics or
                pesticide.
              </p>
              <p>
                6.3 The Customer acknowledges that 1Click, Inc. does not
                Products purchased for safety or efficacy as a food, drug,
                medical device, cosmetic, pesticide or component thereof.
              </p>
              <p>
                6.4 The Customer acknowledges that the hazards, physiological
                properties and toxicological properties of the Products may have
                not yet been fully investigated and/or determined and
                accordingly that the Products should be handled with the utmost
                caution when they are used, stored or during disposal, by
                individuals familiar with their potential hazards and who have
                been fully trained in proper safety, laboratory, and chemical
                handling procedures.
              </p>
              <p>
                6.5 The Customer must warn its own customers and any other
                persons likely to come into contact with the Products of all
                hazards associated with the Products.
              </p>
              <p>
                6.6 The Customer must comply with all applicable laws, rules and
                regulations relating to, and must obtain all licences, permits
                and approvals required in relation to the marketing, promotion
                and advertising of the Products, and the import, export,
                distribution, sale, supply and delivery of the Products.
              </p>
              <p>
                6.7 The Customer must ensure that its use of the Products is
                fully in accordance with any instructions provided to the
                Customer by 1Click, Inc. or by the manufacturer or supplier of
                the Products.
              </p>
            </div>
            <span className="title-text" id="pricesAndPayment">
              7. Prices and payment
            </span>
            <div className="desc-text">
              <p>
                7.1 Guideline prices for Products are quoted on the www.1Click,
                Inc..com website in Euros and US Dollars. The guideline prices
                are ex works, and exclude taxes and duties, and delivery,
                handling, hazard and minimum order charges.
              </p>
              <p>
                7.2 Prices for Products change regularly, and 1Click, Inc. will
                specify the actual prices for the Products:
              </p>
              <ul>
                <li>
                  (a) in the case of a purchase on the website, following
                  receipt of the Customer&apos;s order; and
                </li>
                <li>
                  (b) in the case of a purchase upon quotation, with the written
                  quotation provided to the Customer, subject, in each case, to
                  variation in accordance with Clause 3.7.
                </li>
              </ul>
              <p>
                7.3 In addition to the price of the Products, the Customer will
                have to pay delivery, handling, hazard and/or minimum order
                charges, which 1Click, Inc. will specify at the same time as the
                price is confirmed under Clause 7.2, subject also to variation
                in accordance with Clause 3.7.
              </p>
              <p>
                7.4 Unless the Customer has a 1Click, Inc. account, payment must
                be made upon the submission of the Customer&apos;s order. In
                these circumstances 1Click, Inc. may withhold the Products
                and/or cancel the Contract if payment is not received from the
                Customer in full in cleared funds.
              </p>
              <p>
                7.5 From time to time 1Click, Inc. may agree to open an account
                for a Customer, enabling the Customer to pay in arrears. Where
                the Customer holds an account, then upon or following the
                dispatch of Products, 1Click, Inc. will send to the Customer an
                invoice for payment of the price of those Products, and the
                Customer must pay the full amount due under such invoice within
                30 days following the date on the invoice. Customer accounts
                will be subject to such credit limits as 1Click, Inc. may notify
                to the Customer from time to time. Where a partial dispatch is
                made under a Contract, 1Click, Inc. will issue an invoice for
                the dispatched Products only. The Customer must not delay the
                payment of any invoice on the grounds of a partial dispatch or
                delivery.
              </p>
              <p>
                7.6 All amounts specified on the www.1Click, Inc..com website or
                in a quotation or otherwise payable to 1Click, Inc. under a
                Contract are (unless the context requires otherwise) stated
                exclusive of all value-added taxes, sales taxes, goods and
                services taxes, custom duties, inspection fees, testing fees,
                export/import taxes and duties and any other governmental tax,
                duty or fee imposed by any governmental authority on the
                Products or the Contract, which will be payable by the Customer
                in addition to the price of the Products and other amounts due
                under these Terms.
              </p>
              <p>
                7.7 Payment for all Products must be made by credit or debit
                card on the www.1Click, Inc..com website (in the case of online
                purchases) or by bank transfer.
              </p>
              <p>
                7.8 If the Customer does not pay any amount properly due to
                1Click, Inc. under or in connection with a Contract, 1Click,
                Inc. may charge the Customer:
              </p>
              <ul>
                <li>
                  (a) liquidated damages to compensate 1Click, Inc. for the time
                  and costs spent dealing with the non-payment, equal to 10% of
                  the outstanding balance; and
                </li>
                <li>
                  (b) interest on the overdue amount at the rate of 1% per month
                  above EURIBOR (compounded at the end of each calendar month).
                </li>
              </ul>
              <p>
                7.9 The Customer shall not be entitled in any circumstances to
                withhold or set-off any payment for the Products due under the
                Contract.
              </p>
            </div>
            <span className="title-text" id="warrantiesAndIndemnity">
              8. Warranties and indemnity
            </span>
            <div className="desc-text">
              <p>8.1 1Click, Inc. warrants to the Customer that:</p>
              <ul>
                <li>
                  (a) 1Click, Inc. has (or will have at the relevant time) the
                  right to sell the Products;
                </li>
                <li>
                  (b) the Products are free from any charge or encumbrance,
                  subject to Clause 5;
                </li>
                <li>
                  (c) the Customer shall enjoy quiet possession of the Products,
                  subject to the rights referred to in Clause 8.1(b); and
                </li>
                <li>
                  (d) the Products correspond to:
                  <ul>
                    <li>
                      (i) in the case of a sale of Products following quotation,
                      any description of the Products supplied by 1Click, Inc.
                      to the Customer (excluding information on the www.1Click,
                      Inc..com website); and
                    </li>
                    <li>
                      (ii) in the case of a sale of Products using the website
                      checkout procedure, the manufacturer identity and
                      manufacturer catalogue number stated on the website and
                      the image of the chemical structure of the Product
                      published on the website.
                    </li>
                  </ul>
                </li>
              </ul>

              <p>8.2 The Customer warrants to 1Click, Inc. that:</p>
              <ul>
                <li>
                  (a) the Customer is legally capable of entering into binding
                  contracts, and has full authority, power and capacity to agree
                  to these Terms;
                </li>
                <li>
                  (b) the information provided by the Customer in relation to
                  the Contract is accurate and complete;
                </li>
                <li>
                  (c) the import of the Products into the jurisdiction for
                  delivery will not be unlawful, and the Customer will be able
                  to accept delivery of the Products in the manner anticipated
                  by the Contract;
                </li>
                <li>
                  (d) where a Product (as specified in accordance with Clause
                  8.1(d)) may exist in several types or variations, and the
                  Customer requires a specific type or variation, that will be
                  specified in the Customer&apos;s order form;
                </li>
                <li>
                  (e) the Customer will properly test and use the Products and
                  any article or compound made from or incorporating the
                  Products in accordance with good industry practice and in
                  compliance with all applicable laws and regulations;
                </li>
                <li>
                  (f) the Customer is a commercial, educational and governmental
                  institution or organization, and not a private individual.
                </li>
              </ul>

              <p>
                8.3 All of the parties&apos; warranties, liabilities and
                obligations in respect of the subject matter of each Contract
                are expressly contained in these Terms or elsewhere in the
                relevant Contract. Subject to Clause 12.1 and to the maximum
                extent permitted by applicable law, no other terms concerning
                the subject matter of a Contract will be implied into that
                Contract or any related contract.
              </p>

              <p>
                8.4 The Customer hereby indemnifies 1Click, Inc. and undertakes
                to keep 1Click, Inc. indemnified against all and any
                liabilities, losses, damages, expenses and costs (including
                legal expenses and amounts paid in settlement of any demand,
                action or claim) arising, directly or indirectly, out of a
                breach by the Customer of any of its obligations under a
                Contract or any use by the Customer of the Products supplied
                under a Contract.
              </p>
            </div>
            <span className="title-text" id="inspection">
              9. Inspection and returns
            </span>
            <div className="desc-text">
              <p>
                9.1 Within 10 days following the delivery of Products, the
                Customer must inspect those Products and notify 1Click, Inc. in
                writing of any shortage or defects in, or damage to, those
                Products. If the Customer fails to notify 1Click, Inc. of any
                such matter within this 10 day period, the Products shall be
                conclusively deemed to conform to the terms of the Contract, and
                to have been irrevocably accepted by the Customer.
              </p>

              <p>
                9.2 If Products do not comply with any warranty given by 1Click,
                Inc. under a Contract, and the Customer has notified 1Click,
                Inc. in accordance with Clause 9.1, the Customer may with the
                prior agreement of 1Click, Inc. return those Products to 1Click,
                Inc. or dispose of those Products in accordance with 1Click,
                Inc.&apos;s instructions, for (at the option of 1Click, Inc.):
              </p>
              <ul>
                <li>(a) replacement Products;</li>
                <li>
                  (b) a credit note in respect of the price of the Products
                  (including charges paid by the Customer to 1Click, Inc. in
                  respect of the delivery and handling of the Products) (such
                  credit note to be offset against future purchases from 1Click,
                  Inc.); or
                </li>
                <li>
                  (c) a refund of the price of the Products (including charges
                  paid by the Customer to 1Click, Inc. in respect of the
                  delivery and handling of the Products), plus, where the
                  Products are returned to 1Click, Inc. with the prior agreement
                  of 1Click, Inc., a full credit of the reasonable costs of
                  returning the Products.
                </li>
              </ul>

              <p>9.3 Products returned under Clause 9.2 must be:</p>
              <ul>
                <li>
                  (a) properly packed by the Customer in accordance with 1Click,
                  Inc.&apos;s instructions;
                </li>
                <li>
                  (b) sent by appropriate delivery means in accordance with
                  1Click, Inc.&apos;s instructions; and
                </li>
                <li>
                  (c) returned to the address and in accordance with any
                  timetable specified by 1Click, Inc. (or, if no timetable is
                  specified, within 10 days following 1Click, Inc. consenting to
                  the return of the Products).
                </li>
              </ul>

              <p>
                9.4 Any Products returned in contravention of the provisions
                this Clause 9 will not be the subject of any credits or
                replacements or other remedies, and where applicable the
                Customer will continue to be liable for payment of the price of
                such Products.
              </p>

              <p>
                9.5 For the avoidance of doubt, the &quot;Guarantee&quot;
                document published on the 1Click, Inc. website does not apply to
                the sale of Products directly by 1Click, Inc.
              </p>
            </div>
            <span className="title-text" id="productLiability">
              10. Product Liability Claims
            </span>
            <div className="desc-text">
              <p>The Customer will:</p>
              <ul>
                <li>
                  (a) promptly notify 1Click, Inc. upon becoming aware of any
                  accident involving the Products or any incident involving the
                  Products that may give rise to a Product Liability Claim;
                </li>
                <li>
                  (b) promptly notify 1Click, Inc. upon becoming aware of a
                  Product Liability Claim; and
                </li>
                <li>
                  (c) provide to 1Click, Inc. all reasonable assistance in
                  relation to any actual or potential Product Liability Claim,
                  including making available to 1Click, Inc. all statements,
                  reports and tests made by the Customer or made available to
                  the Customer by a third party.
                </li>
              </ul>
            </div>
            <span className="title-text" id="IPR">
              11. IPR disclaimer
            </span>
            <div className="desc-text">
              <p>
                Subject to Clause 12.1, 1Click, Inc. does not warrant or
                represent that the Products, or that the supply, sale or use of
                the Products whether alone or in combination with any other
                products, will not infringe any patent rights or other
                Intellectual Property Rights.
              </p>
            </div>
            <span className="title-text" id="limitations">
              12. Limitations and exclusions of liability
            </span>
            <div className="desc-text">
              <p>12.1 Nothing in the Contract will:</p>
              <ul>
                <li>
                  (a) limit or exclude the liability of a party for death or
                  personal injury resulting from negligence;
                </li>
                <li>
                  (b) limit or exclude the liability of a party for fraud or
                  fraudulent misrepresentation by that party;
                </li>
                <li>
                  (c) limit any liability of a party in any way that is not
                  permitted under applicable law; or
                </li>
                <li>
                  (d) exclude any liability of a party that may not be excluded
                  under applicable law.
                </li>
              </ul>

              <p>
                12.2 The limitations and exclusions of liability set out in this
                Clause 12 and elsewhere in these Terms:
              </p>
              <ul>
                <li>(a) are subject to Clause 12.1; and</li>
                <li>
                  (b) govern all liabilities arising under the Contract or in
                  relation to the subject matter of the Contract, including
                  liabilities arising in contract, in tort (including
                  negligence) and for breach of statutory duty.
                </li>
              </ul>

              <p>
                12.3 1Click, Inc. will not be liable in respect of any loss of
                profits, income, revenue, use, production or anticipated
                savings.
              </p>
              <p>
                12.4 1Click, Inc. will not be liable for any loss of business,
                contracts or commercial opportunities.
              </p>
              <p>
                12.5 1Click, Inc. will not be liable for any loss of or damage
                to goodwill or reputation.
              </p>
              <p>
                12.6 1Click, Inc. will not be liable in respect of any loss or
                corruption of any data, database or software.
              </p>
              <p>
                12.7 1Click, Inc. will not be liable in respect of any special,
                indirect or consequential loss or damage.
              </p>
              <p>
                12.8 1Click, Inc. will not be liable for any loss or damage
                resulting from incorrect handling, storage, usage or disposal of
                the Products.
              </p>
              <p>
                12.9 1Click, Inc. will not be liable for any losses arising out
                of a Force Majeure Event.
              </p>
              <p>
                12.10 1Click, Inc.&apos;s aggregate liability under a Contract
                will not exceed the total amount paid or (if greater) payable by
                the Customer to 1Click, Inc. under the Contract.
              </p>
            </div>

            <span className="title-text" id="forceMajeure">
              13. Force majeure
            </span>
            <div className="desc-text">
              <p>
                13.1 Where a Force Majeure Event gives rise to a failure or
                delay in 1Click, Inc. performing its obligations under a
                Contract, those obligations will be suspended for the duration
                of the Force Majeure Event.
              </p>
              <p>
                13.2 Where 1Click, Inc. becomes aware of a Force Majeure Event
                which gives rise to, or which is likely to give rise to, any
                failure or delay in performing its obligations under a Contract,
                1Click, Inc. will notify the Customer.
              </p>
              <p>
                13.3 1Click, Inc. will take reasonable steps to mitigate the
                effects of the Force Majeure Event.
              </p>
              <p>
                13.4 For the avoidance of doubt, the Customer will have no right
                to terminate a Contract on the grounds that its performance has
                been delayed by a Force Majeure Event.
              </p>
            </div>

            <span className="title-text" id="contractTermination">
              14. Contract term and termination
            </span>
            <div className="desc-text">
              <p>
                14.1 Each Contract will come into force in accordance with
                Clause 3, and will continue in force until the earlier of:
              </p>
              <ul>
                <li>
                  (a) the later of completion of: (i) delivery of all Products;
                  and (ii) the receipt by 1Click, Inc. of all amounts due to
                  1Click, Inc. under the Contract; and
                </li>
                <li>
                  (b) the termination of the Contract in accordance with the
                  provisions of this Clause.
                </li>
              </ul>

              <p>
                14.2 A Contract may be terminated in the following
                circumstances:
              </p>
              <ul>
                <li>
                  (a) either party may terminate a Contract immediately by
                  giving written notice to the other party if the other party
                  commits any material breach of any term of the Contract;
                </li>
                <li>
                  (b) 1Click, Inc. may terminate any Contract immediately by
                  giving written notice to the Customer if the Customer fails to
                  pay to 1Click, Inc. any amount due under the Contract by the
                  due date for payment;
                </li>
                <li>
                  (c) 1Click, Inc. may terminate any Contract immediately by
                  giving written notice to the Customer if the Customer fails to
                  accept delivery of the Products on the date agreed in the
                  relevant Contract; and
                </li>
                <li>
                  (d) 1Click, Inc. may terminate any Contract immediately by
                  giving written notice to the Customer if a Force Majeure Event
                  prevents the performance of the Contract by 1Click, Inc. for a
                  period of 30 or more days.
                </li>
              </ul>

              <p>
                14.3 Either party may terminate any Contract immediately by
                giving written notice to the other party if:
              </p>
              <ul>
                <li>
                  (a) the other party: (i) is dissolved; (ii) ceases to conduct
                  all (or substantially all) of its business; (iii) is or
                  becomes unable to pay its debts as they fall due; (iv) is or
                  becomes insolvent or is declared insolvent; or (v) convenes a
                  meeting or makes or proposes to make any arrangement or
                  composition with its creditors;
                </li>
                <li>
                  (b) an administrator, administrative receiver, liquidator,
                  receiver or similar is appointed over any of the assets of the
                  other party;
                </li>
                <li>
                  (c) an order is made for the winding up of the other party, or
                  the other party passes a resolution for its winding up (other
                  than for the purpose of a solvent company reorganization where
                  the resulting entity will assume all the obligations of the
                  other party under the Contract); or
                </li>
                <li>
                  (d) (where that other party is an individual) that other party
                  dies, or as a result of illness or incapacity becomes
                  incapable of managing his or her own affairs, or is the
                  subject of a bankruptcy petition or order.
                </li>
              </ul>
            </div>

            <span className="title-text" id="effectsTermination">
              15. Effects of termination
            </span>
            <div className="desc-text">
              <p>
                15.1 Upon termination of a Contract, all the provisions of that
                Contract will cease to have effect, save that the following
                provisions of these Terms will survive and continue to have
                effect (in accordance with their terms or otherwise
                indefinitely): Clauses 1, 5, 6, 7.8, 9, 10, 12, 15 and 18.
              </p>
              <p>
                15.2 Termination of a Contract will not affect either
                party&apos;s accrued rights (including accrued rights to be paid
                and accrued rights to a remedy for breach of condition or
                warranty) as at the date of termination.
              </p>
            </div>
            <span className="title-text" id="scopeThese">
              16. Scope of these terms of sale and supply
            </span>
            <div className="desc-text">
              <p>
                These Terms do not constitute or contain any assignment or
                licence of any Intellectual Property Rights in any Product, and
                do not govern the provision of any services by 1Click, Inc. or
                any third party in relation to any Products.
              </p>
            </div>

            <span className="title-text" id="notices">
              17. Notices
            </span>
            <div className="desc-text">
              <p>
                Any notice given under a Contract must be in writing (whether or
                not described as &quot;written notice&quot; in these Terms) and
                must be delivered personally, sent by recorded signed-for mail,
                or sent by fax, for the attention of the relevant person, and to
                the relevant address or fax number given below (or as notified
                by one party to the other in accordance with this Clause).
              </p>
              <p>
                The addressee, address and fax number given on the website order
                form, or in the case of orders following a written quotation,
                the addressee, address and fax number given in the quotation.
              </p>
            </div>

            <span className="title-text" id="general">
              18. General
            </span>
            <div className="desc-text">
              <p>
                18.1 No breach of any provision of a Contract will be waived
                except with the express written consent of the party not in
                breach.
              </p>

              <p>
                18.2 If any provision of a Contract is determined by any court
                or other competent authority to be unlawful and/or
                unenforceable, the other provisions of the Contract will
                continue in effect. If any unlawful and/or unenforceable
                provision would be lawful or enforceable if part of it were
                deleted, that part will be deemed to be deleted, and the rest of
                the provision will continue in effect (unless that would
                contradict the clear intention of the parties, in which case the
                entirety of the relevant provision will be deemed to be
                deleted).
              </p>

              <p>
                18.3 Contracts may not be varied except by a written document
                signed by or on behalf of each of the parties.
              </p>

              <p>
                18.4 1Click, Inc. may freely assign its rights and obligations
                under a Contract without the Customer’s consent. The Customer
                may not without the prior written consent of 1Click, Inc.
                assign, transfer, charge, license or otherwise dispose of or
                deal in a Contract or any rights or obligations under a
                Contract.
              </p>

              <p>
                18.5 Each Contract is made for the benefit of the parties, and
                is not intended to benefit any third party or be enforceable by
                any third party. The rights of the parties to terminate,
                rescind, or agree any amendment, waiver, variation or settlement
                under or relating to a Contract are not subject to the consent
                of any third party.
              </p>

              <p>18.6 Subject to Clause 12.1:</p>
              <ul>
                <li>
                  (a) these Terms will constitute the entire agreement between
                  the parties in relation to the subject matter of the Contract,
                  and supersede all previous agreements, arrangements and
                  understandings between the parties in respect of that subject
                  matter;
                </li>
                <li>
                  (b) neither party will have any remedy in respect of any
                  misrepresentation (whether written or oral) made to it upon
                  which it relied in entering into a Contract; and
                </li>
                <li>
                  (c) neither party will have any liability other than pursuant
                  to the express terms of a Contract.
                </li>
              </ul>

              <p>
                18.7 These Terms and each Contract will be governed by and
                construed in accordance with English law.
              </p>

              <p>
                18.8 1Click, Inc. may issue and pursue legal proceedings against
                the Customer:
              </p>
              <ul>
                <li>
                  (a) where the Customer is a company, organization or
                  institution, in any jurisdiction in which the Customer has its
                  head office, a branch office or other premises, or in which
                  the Customer is incorporated or established; or
                </li>
                <li>
                  (b) where the Customer is a sole trader, in any jurisdiction
                  in which the Customer has an office or other premises, or in
                  which the Customer is resident or situated from time to time.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
