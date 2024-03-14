import Image from "next/image";
import Pagination from "./components/Pagination";

export default function Home() {
  return <Pagination currentPage={2} totalCount={100} pageSize={10} />;
}
