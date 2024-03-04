import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";
import { Loading } from "./_components/loading";


interface SlateIdPageProps {
  params: {
    slateId: string;
  };
};

const SlateIdPage = ({
  params,
}: SlateIdPageProps) => {

  return (
      <Room roomId={params.slateId} fallback={<Loading />}>
          <Canvas slateId={params.slateId} />
      </Room>
  );
};

export default SlateIdPage;