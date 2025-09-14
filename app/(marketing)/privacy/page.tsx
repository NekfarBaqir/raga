import Link from "next/link"

const page = () => {
  return (
    <div className="flex flex-col items-start justify-start h-fit py-10 max-w-7xl mx-auto px-3">
      <h1 className="text-2xl w-full text-center md:text-left lg:text-3xl xl:text-4xl font-bold py-12 pb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground w-full text-center md:text-left">Effective Date: September 14, 2025</p>

      <p className="mt-8 text-base leading-7">
        Raga values your privacy. This Privacy Policy explains how we collect, use, and protect your information.
      </p>

      <ol className="list-decimal pl-6 space-y-6 mt-8">
        <li>
          <h2 className="font-semibold mb-2">Information We Collect</h2>
          <p className="mb-2">When you apply or use our website, we may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Personal details (name, email, phone number).</li>
            <li>Team or company information provided in the application form.</li>
            <li>Usage data (e.g., how you interact with our website).</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold mb-2">How We Use Your Information</h2>
          <p className="mb-2">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Review and process applications.</li>
            <li>Communicate updates and decisions.</li>
            <li>Improve our services and workspace.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Data Sharing</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We do not sell or trade your data.</li>
            <li>
              We may share limited data with trusted partners (e.g., Entop) for operational purposes.
            </li>
            <li>Data may be disclosed if required by law.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Data Security</h2>
          <p>
            We take reasonable steps to protect your personal data, but no system is 100% secure. Please use our services responsibly.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You may request access to the personal data we hold about you.</li>
            <li>You may request correction or deletion of your information.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Cookies & Tracking</h2>
          <p>
            Our website may use basic cookies to improve user experience. You can disable cookies in your browser at any time.
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy as needed. Updates will be posted on this page with a new “Effective Date.”
          </p>
        </li>
        <li>
          <h2 className="font-semibold mb-2">Contact Us</h2>
          <p>
            For questions about this Privacy Policy, please contact us at: <Link href="/contact" className="text-primary underline transition-colors">Contact Page</Link>.
          </p>
        </li>
      </ol>
    </div>
  )
}

export default page


