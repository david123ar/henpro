// import Navbar from "@/components/Navbar/Navbar";
import Series from "@/components/Trending/Trending";

export default async function TrendingPage({ searchParams }) {
  const page = searchParams.page || 1;

  const apiUrl = `https://api.henpro.fun/api/trending?page=${page}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series");
  }

  const data = await res.json();

  return (
    <div className="page-wrapper">
      <Series data={data || []} totalPages={data?.totalPages || 1} />
    </div>
  );
}
