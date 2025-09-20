import Link from "next/link"

const page = () => {
  return (
    <div className="flex flex-col items-start justify-start h-fit py-10 max-w-7xl mx-auto px-3">
      <h1 className="text-2xl w-full text-center md:text-left lg:text-3xl xl:text-4xl font-bold py-12 pb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground w-full text-center md:text-left">Effective Date: September 14, 2025</p>

      <p className="mt-8 text-base leading-7">
        Welcome to Raga. By accessing or using our website, facilities, or services, you agree to the following Terms & Conditions. Please read them carefully.
      </p>

      <ol className="list-decimal pl-6 space-y-6 mt-8">
        <li>
          <h2 className="font-semibold mb-2">Acceptance of Terms</h2>
          <p>
            By applying to join, visiting our space, or using any of our services, you agree to these Terms & Conditions. If you do not agree, please do not use our services.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Eligibility</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Applicants must be at least 18 years old.</li>
            <li>Both individuals and teams may apply.</li>
            <li>All applications are subject to review and approval by the Raga team.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Use of Facilities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Members must respect the workspace, equipment, and other members.</li>
            <li>Misuse of facilities or disruptive behavior may result in suspension or removal.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold mb-2">No Equity</h2>
          <p>
          Raga does not charge rent, fees, or take equity from its members. The space is funded by Entop and community partners who believe in supporting Afghan innovators. To ensure the environment stays clean, safe, and sustainable for everyone, we ask for a modest contribution of 500 Afghani for maintenance and upkeep.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Intellectual Property</h2>
          <p>
            Any ideas, projects, or businesses you build at Raga remain your sole property. Raga does not claim ownership.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Limitation of Liability</h2>
          <p>
            Raga provides facilities and community support “as is.” We are not responsible for any losses, damages, or liabilities resulting from the use of our space or services.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Changes to Terms</h2>
          <p>
            Raga may update these Terms & Conditions at any time. Continued use of our services means you accept the updated terms.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions, please contact us at:  <Link href="/contact" className="text-primary underline transition-colors">Contact Page</Link>.
          </p>
        </li>
      </ol>
    </div>
  )
}

export default page


