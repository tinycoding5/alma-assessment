import PageContainer from "@/components/layout/PageContainer";
import LeadForm from "@/components/leads/LeadForm";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Get An Assessment Of Your Immigration Case</title>
        <meta
          name="description"
          content="Submit your information for a professional assessment of your immigration case options."
        />
      </Head>
      <PageContainer>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="flex items-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">aimé</h1>
            </div>
            <LeadForm />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
