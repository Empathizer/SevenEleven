import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SellerPoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Seller Service Agreement</h1>
          <p className="text-gray-600 mb-8">Effective Date: December 31, 2021</p>

          <div className="space-y-6 text-gray-700">
            <p>
              This Seller Service Agreement ("Agreement") governs the relationship between esellerstore.shop ("Platform," "we," "us," or "our") and the seller registering for and using the Platform ("Seller," "you," or "your").
            </p>
            <p>
              By creating a seller account, opening a store, or using any seller services on esellerstore.shop, you confirm that you have read, understood, and agreed to be legally bound by this Agreement.
            </p>
            <p className="font-semibold">
              If you do not agree with any part of this Agreement, you must not register or operate a store on the Platform.
            </p>
          </div>

          <div className="space-y-8 mt-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Definitions</h2>
              <ul className="list-none space-y-3 text-gray-700">
                <li><strong>Platform:</strong> The website located at esellerstore.shop and any related applications, software, or services operated under the same brand.</li>
                <li><strong>Seller:</strong> Any individual, business entity, or legal person authorized to sell goods or services through the Platform.</li>
                <li><strong>Buyer:</strong> Any individual or organization purchasing goods or services through the Platform.</li>
                <li><strong>Services:</strong> All technical, marketing, payment-related, data, and support services provided by esellerstore.shop to Sellers.</li>
                <li><strong>Rules and Policies:</strong> All guidelines, policies, announcements, and operational standards published on the Platform, as updated from time to time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Acceptance and Scope</h2>
              <p className="text-gray-700 mb-3"><strong>2.1</strong> This Agreement forms a legally binding contract between you and esellerstore.shop.</p>
              <p className="text-gray-700 mb-3"><strong>2.2</strong> The Platform's Rules and Policies, Consumer Protection Policy, Privacy Policy, and any other published guidelines are incorporated into this Agreement by reference.</p>
              <p className="text-gray-700"><strong>2.3</strong> We may modify this Agreement at any time. Continued use of the Platform after updates constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Seller Eligibility</h2>
              <p className="text-gray-700 mb-3"><strong>3.1</strong> You represent and warrant that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
                <li>You are legally capable of entering into binding contracts.</li>
                <li>If acting on behalf of a business entity, you are authorized to bind that entity.</li>
                <li>All registration information provided is accurate, current, and complete.</li>
              </ul>
              <p className="text-gray-700"><strong>3.2</strong> We reserve the right to approve or reject any seller application at our sole discretion.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Account Responsibility</h2>
              <p className="text-gray-700 mb-3"><strong>4.1</strong> You are solely responsible for maintaining the confidentiality of your account credentials.</p>
              <p className="text-gray-700 mb-3"><strong>4.2</strong> You may not transfer, sell, rent, or assign your account without prior written approval from esellerstore.shop.</p>
              <p className="text-gray-700 mb-3"><strong>4.3</strong> You are fully responsible for all activities conducted through your account.</p>
              <p className="text-gray-700"><strong>4.4</strong> We may suspend or terminate accounts that pose security risks or violate this Agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Store Operations</h2>
              <p className="text-gray-700 mb-3"><strong>5.1</strong> Each Seller may operate only one store unless expressly authorized in writing.</p>
              <p className="text-gray-700 mb-3"><strong>5.2</strong> Sellers must:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
                <li>Provide accurate product descriptions.</li>
                <li>Clearly disclose pricing, taxes, shipping fees, and delivery timelines.</li>
                <li>Maintain updated inventory information.</li>
                <li>Fulfill all confirmed orders promptly.</li>
              </ul>
              <p className="text-gray-700 mb-3"><strong>5.3</strong> Store ownership may not be transferred without written approval from the Platform.</p>
              <p className="text-gray-700"><strong>5.4</strong> Closing a store does not release the Seller from obligations related to previous transactions, including refunds, returns, warranties, or dispute handling.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Product Listings and Prohibited Activities</h2>
              <p className="text-gray-700 mb-3"><strong>6.1</strong> You may only list products or services that you are legally authorized to sell.</p>
              <p className="text-gray-700 mb-3"><strong>6.2</strong> You must ensure that listings:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
                <li>Comply with all applicable laws and regulations.</li>
                <li>Do not infringe intellectual property rights.</li>
                <li>Are truthful and not misleading.</li>
              </ul>
              <p className="text-gray-700 mb-3"><strong>6.3</strong> The following are strictly prohibited:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
                <li>Illegal or restricted goods.</li>
                <li>Counterfeit or infringing products.</li>
                <li>Fraudulent or deceptive listings.</li>
                <li>Content that is obscene, violent, defamatory, or unlawful.</li>
                <li>Use of malicious software or attempts to disrupt Platform systems.</li>
                <li>Artificial manipulation of ratings, reviews, or sales.</li>
              </ul>
              <p className="text-gray-700"><strong>6.4</strong> The Platform may remove listings, restrict visibility, or suspend accounts for violations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Pricing, Payments, and Fees</h2>
              <p className="text-gray-700 mb-3"><strong>7.1</strong> Sellers are responsible for setting lawful and transparent pricing.</p>
              <p className="text-gray-700 mb-3"><strong>7.2</strong> The Platform may charge service fees, transaction fees, advertising fees, or other charges as published in the fee schedule.</p>
              <p className="text-gray-700 mb-3"><strong>7.3</strong> Sellers are responsible for all taxes applicable to their sales and business operations.</p>
              <p className="text-gray-700"><strong>7.4</strong> The Platform may withhold funds if necessary to resolve disputes, refunds, chargebacks, or violations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Consumer Protection Obligations</h2>
              <p className="text-gray-700 mb-3"><strong>8.1</strong> Sellers are responsible for complying with applicable consumer protection laws.</p>
              <p className="text-gray-700 mb-3"><strong>8.2</strong> Sellers must:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
                <li>Deliver goods as described.</li>
                <li>Honor return and refund obligations.</li>
                <li>Provide reasonable after-sales support.</li>
              </ul>
              <p className="text-gray-700"><strong>8.3</strong> Failure to meet consumer obligations may result in penalties, suspension, or termination.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Dispute Resolution</h2>
              <p className="text-gray-700 mb-3"><strong>9.1</strong> Sellers and Buyers are encouraged to resolve disputes directly.</p>
              <p className="text-gray-700 mb-3"><strong>9.2</strong> The Platform may provide mediation services but does not act as a party to the transaction.</p>
              <p className="text-gray-700 mb-3"><strong>9.3</strong> The Platform's dispute decisions are binding unless overturned by a final legal authority.</p>
              <p className="text-gray-700"><strong>9.4</strong> This Agreement shall be governed by the laws of the jurisdiction in which esellerstore.shop is registered, unless otherwise required by applicable law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Data and Intellectual Property</h2>
              <p className="text-gray-700 mb-3"><strong>10.1</strong> The Platform retains ownership of all software, systems, databases, and proprietary technology.</p>
              <p className="text-gray-700 mb-3"><strong>10.2</strong> Sellers retain ownership of their trademarks and product content but grant the Platform a non-exclusive, worldwide license to use, display, and promote such content for operational and marketing purposes.</p>
              <p className="text-gray-700"><strong>10.3</strong> Sellers may not extract, copy, or misuse Platform data without written authorization.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-3"><strong>11.1</strong> The Platform provides services on an "as-is" and "as-available" basis.</p>
              <p className="text-gray-700 mb-3"><strong>11.2</strong> To the maximum extent permitted by law, esellerstore.shop shall not be liable for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
                <li>Indirect or consequential losses,</li>
                <li>Loss of profits or business opportunities,</li>
                <li>Interruptions beyond its reasonable control.</li>
              </ul>
              <p className="text-gray-700"><strong>11.3</strong> The Platform's total liability shall not exceed the total service fees paid by the Seller in the preceding three (3) months.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-3"><strong>12.1</strong> Either party may terminate this Agreement in accordance with applicable rules.</p>
              <p className="text-gray-700 mb-3"><strong>12.2</strong> The Platform may suspend or terminate accounts immediately for serious violations.</p>
              <p className="text-gray-700"><strong>12.3</strong> Termination does not affect obligations arising before termination.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Indemnification</h2>
              <p className="text-gray-700 mb-3">
                You agree to indemnify and hold harmless esellerstore.shop from any claims, losses, damages, liabilities, or legal costs arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your breach of this Agreement,</li>
                <li>Your violation of laws,</li>
                <li>Claims relating to your products or services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Miscellaneous</h2>
              <p className="text-gray-700 mb-3"><strong>14.1</strong> If any provision is found invalid, the remaining provisions remain enforceable.</p>
              <p className="text-gray-700 mb-3"><strong>14.2</strong> Failure to enforce any provision does not waive our rights.</p>
              <p className="text-gray-700"><strong>14.3</strong> This Agreement constitutes the entire agreement between the parties regarding seller services.</p>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-700">
                For questions about this Seller Service Agreement, contact us at:{' '}
                <a href="mailto:support@esellerstore.shop" className="text-blue-600 hover:underline">
                  support@esellerstore.shop
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
