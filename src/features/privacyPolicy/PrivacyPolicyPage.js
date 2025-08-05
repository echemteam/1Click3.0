import React from "react";
import "./PrivacyPolicyPage.scss";
import Link from "next/link";
const navItems = [
  {
    label: "Privacy Policy",
    href: "#privacyPolicy",
    itemId: "privacyPolicy",
    descItem:
      "This Privacy Policy tells you how 1Click (1Click, Inc) collects, uses and works to protect the information it collects when you participate in the Network. By participating in the Network you agree to the terms and conditions of the Network Agreement, including this Privacy. This includes the use and disclosure of any personal information you have shared with us and its transfer to and storage on our servers.",
  },
  {
    label: "Collection",
    href: "#collection",
    itemId: "collection",
    descItem:
      "If you register as a 1Click user, we may collect some personal and payment information from you, including:",
    isList: true,
    listItem: [
      "Information that you provide to us when you register to identify you in the program (including user name, password, and a secret question and answer).",
      "Personal and company contact information, such as name and title, phone number, e-mail and mailing address.",
      "Payment / Reimbursement information, including VAT ID, Federal tax ID or social security number, Credit Card, PayPal and bank account and routing number.",
      "Information about your interactions, including, for example, your promotional methods and agents, performance statistics, transaction, payment history, order history and support requests.",
      "Information from service providers that help with our fraud prevention and network quality efforts.",
      "Web log information we collect automatically, including IP address, computer and connection information, tracking code data, browser type and version, operating system and platform, referring and following URLs, and cookie data.",
      "For analytical purposes, we use Google Analytics which may collect and log IP address, tracking data, browser details, and cookie info.",
    ],
  },
  {
    label: "Use",
    href: "#use",
    itemId: "use",
    descItem: "We use the information we collect to:",
    isList: true,
    listItem: [
      "Run the Network and your chosen Programs and provide you with services you request.",
      "Communicate with you about your transactions, service updates and other administrative issues.",
      "Send you targeted marketing and product updates based on your communication preferences.",
      "Analyze trends, monitor and maintain integrity, and improve the program.",
      "Resolve disputes, address complaints and troubleshoot technical problems.",
      "Comply with applicable laws and regulations.",
    ],
  },
  {
    label: "Sharing and Disclosure",
    href: "#sharingAndDisclosure",
    itemId: "sharingAndDisclosure",
    descItem:
      "As part of our marketing and operation of the Network, we may disclose information about you to the following parties:",
    isList: true,
    listItem: [
      "To Participating Supplier: If you placed an order, we may provide your address and contact information to suppliers.",
      "Advertiser: We will share your information with the Advertiser whose Program you participate in.",
      "Other eChemPoral Companies: We may share with our parent or sister companies for joint operations and analytics.",
      "Service Providers: Contractors like FedEx, UPS, or DHL receive information necessary for order delivery.",
      "Legal Disclosures: We may disclose when required by law, or to protect our rights and safety.",
      "Assets: If our business is sold or merged, personal data may be transferred as part of the assets.",
      "Third-party websites: We are not responsible for their privacy policies or practices.",
    ],
  },
  {
    label: "E-mail Communications",
    href: "#EMailCommunications",
    itemId: "EMailCommunications",
    descItem:
      "We may occasionally use the contact information you provide to send you emails or other communications. You may opt out of receiving marketing emails but not essential administrative emails. Preferences can be managed in your account or via email footer links.",
  },
  {
    label: "Cookies",
    href: "#cookies",
    itemId: "cookies",
    descItem: [
      'A cookie is a text file sent by a web server to a browser and stored by the browser. This allows tracking between page requests. We use "session" cookies and may occasionally use "persistent" cookies.',
      `We will send you cookies that may be stored on by your browser on your computer's hard drive. We may use the information we obtain from the cookie in the administration of this website and to improve the website's usability. We may also use cookies to recognize your computer when you visit our website and to enable an auto-login feature. Whilst session cookies will be deleted from your computer when you close your browser, persistent cookies will remain stored on your computer until deleted, or until they reach a specified expiry date. Most browsers allow you to refuse to accept cookies. (For example, in Internet Explorer you can refuse all cookies by clicking "Tools", "Internet Options", "Privacy", and selecting "Block all cookies" using the sliding selector.) This will, however, have a negative impact upon the usability of many websites.`,
      `In addition, we use Google Analytics to analyze the use of this website. Google Analytics generates statistical and other information about website use by means of cookies, which are stored on users' computers. The information generated relating to our website is used to create reports about the use of the website. Google will store this information. Google's privacy policy is available at: http://www.google.com/privacypolicy.html.`,
    ],
  },
  {
    label: "Your Personal Information",
    href: "#yourPersonalInformation",
    itemId: "yourPersonalInformation",
    descItem: [
      "As a registered user, you can review and change your personal information by accessing My Settings. You should promptly update your personal information if it changes or becomes inaccurate.",
      `You can request that we close your user account by contacting 1Click customer support. After we close your account, we may retain some information to comply with the law, prevent fraud, assist with investigations, resolve disputes, analyze or troubleshoot programs, enforce our Network Agreement and take actions otherwise permitted by law. If your account or membership is terminated or suspended, we may retain some information to prevent re-registration.`,
    ],
  },
  {
    label: "Your Rights",
    href: "#yourRights",
    itemId: "yourRights",
    descItem: [
      " You may instruct us to provide you with any personal information we hold about you and shared with service providers. Subscription users may instruct us not to process your personal data for marketing purposes by email at any time.",
    ],
  },
  {
    label: "Security",
    href: "#security",
    itemId: "security",
    descItem: [
      "We view protection of your privacy as a very important principle. We store and process your information on servers located in the United States. We have implemented physical, electronic and procedural safeguards that are designed to protect the security of your information. These include advanced firewall and password protection for our databases, physical access controls to our buildings and files, and restricted access to your personal information to employees that need to know that information to operate, develop or improve our services.",
    ],
  },
{
    label: "Information Protection",
    href: "#informationProtection",
    itemId: "informationProtection",
    descItem: [
      "1Click takes explicit measures to ensure the security and protection of personal information:",
    ],
    isList: true,
    listItem: [
      "When appropriate, 1Click will utilize HTTPS secure browser access connections with 128-bit SSL encryption to protect the transmission of personal information and sensitive data.",
      "All 1Click production servers reside in a secure third-party co-location facility with substantial security measures for physical and network access protection.",
      "Access to personal information and server log file data is tightly controlled within 1Click. Access is restricted to a minimum number of key employees who are bound by strict confidentiality obligations.",
      "1Click will make a good faith effort to ensure personal data is accurate and complete, and to provide users with access to correct, update or delete personal information when reasonably possible.",
      "1Click conducts periodic audits to ensure adequate security measures are implemented and adhered to.",
      "Of course, data transmission over the internet is inherently insecure, and 1Click cannot guarantee the security of data sent over the internet.",
      "You are responsible for keeping your password and user details confidential. 1Click will not ask you for your password",
    ],
  },
  {
    label: "Privacy Policy Modifications",
    href: "#privacyPolicyModifications",
    itemId: "privacyPolicyModifications",
    descItem: [
      "1Click reserves the right to modify and update this privacy policy from time-to-time by posting a new version on our website. You should check this page occasionally to ensure you are happy with any changes.",
      `Our intent is to make changes only when it will allow us to improve the reliability and value of the services we provide; or improve the level of privacy protection and confidentiality we support. We intend to maintain the highest possible standards for privacy protection that are consistent with the services we provide. If you have questions about this Policy, contact us through our website or write us at:`,
      "",
      "1ClickChemistry, Inc.",
      "PO BOX 1638",
      "Allen, TX 75013, USA",

    ],
  },
];
const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy-content">
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
            {navItems.map((item, index) => (
              <div key={index}>
                <span className="title-text" id={item.itemId}>
                  {item.label}
                </span>
                <div className="desc-text">
                  {typeof item.descItem === "string" ? (
                    <p>{item.descItem}</p>
                  ) : (
                    item.descItem.map((desc, pIndex) => (
                      <p key={pIndex}>{desc}</p>
                    ))
                  )}

                  {item.isList &&
                    Array.isArray(item.listItem) &&
                    item.listItem.length > 0 && (
                      <ul>
                        {item.listItem.map((li, liIndex) => (
                          <li key={liIndex}>{li}</li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
