import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { serverClient as client } from "@/lib/sanity.server";

export default async function SubscriberManagement() {
  const subscribers = await client.fetch(`*[_type == "subscriber"] | order(subscribedAt desc)`);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-serif text-forest mb-8">Subscriber Management</h1>

        <div className="bg-white rounded-xl border border-tan/30 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-forest/5 text-forest font-serif uppercase tracking-wider text-xs border-b border-tan/20">
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tan/10 text-sm">
              {subscribers.map((sub: any) => (
                <tr key={sub._id}>
                  <td className="px-6 py-4 font-medium">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      sub.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-forest/50">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-forest/40 italic">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
