import { BackArrow } from "@/assets/icon/icons";
import { useRouter } from "next/navigation";

function BackButton({ previousPage = "" }: { previousPage?: string }) {
  const router = useRouter();
  return (
    <div
      onClick={() => previousPage ? router.push(previousPage) : router.back()}
      className="cursor-pointer rounded-full p-2 transition hover:bg-gray-200"
    >
      <BackArrow />
    </div>
  );
}

export default BackButton;
