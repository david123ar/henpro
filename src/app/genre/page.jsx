import Genre from "@/components/Genre/Genre";
// import Navbar from "@/components/Navbar/Navbar";


export default async function SeriesPage({ searchParams }) {
  const page = searchParams.page || 1;
  const genre = searchParams.genre;

  const apiUrl = `https://api.henpro.fun/api/genre?genre=${genre}&page=${page}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series");
  }

  const data = await res.json();

  return (
    <div className="page-wrapper">
      {/* <Navbar now={false} /> */}
      <Genre data={data || []} genre={genre} totalPages={data?.totalPages || 1} />
    </div>
  );
}
