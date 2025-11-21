export const Card = ({ children }: { children: React.ReactNode }) => {


   return (
    <div className="p-4 m-2 border border-gray-300 shadow-md rounded-lg w-full h-full flex justify-center items-center text-center ">
      {children}
    </div>
  );
}