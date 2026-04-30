import { SignUp } from "@clerk/nextjs";

export default function InscriptionPage() {
  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-md rounded-xl border border-gray-100",
            headerTitle: "text-[#0D3B66] font-bold",
            headerSubtitle: "text-gray-500",
            formButtonPrimary:
              "bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold rounded transition-colors",
            footerActionLink: "text-[#F5A623] hover:text-[#e09510]",
            formFieldInput:
              "border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D3B66] focus:border-transparent",
            tabButton: "text-[#0D3B66]",
            tabButtonActive: "border-b-2 border-[#0D3B66] font-semibold",
          },
          variables: {
            colorPrimary: "#0D3B66",
            colorTextOnPrimaryBackground: "#ffffff",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "0.5rem",
          },
        }}
      />
    </section>
  );
}