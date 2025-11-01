// import Navbar from "@/components/Navbar/Navbar";
import Search from "@/components/Search/Search";
// import Series from "@/components/Series/Series";

export default async function SeriesPage({ searchParams }) {
  const q = searchParams.q || 1;

  const apiUrl = `https://api.henpro.fun/api/search?q=${q}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series");
  }

  const data = await res.json();

  return (
    <div className="page-wrapper">
      <Search data={data || []} keyword={q} />
    </div>
  );
}
