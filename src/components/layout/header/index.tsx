import Navigation from "./navigation";
import Avatar from "./user-menu";

export default function Header() {
  return (
    <header className="h-18 flex p-4 bg-gradient-to-r from-blue-600 to-blue-500 transition-opacity ease-in-out duration-initial backdrop-opacity-95 text-white">
      <div className="w-full flex justify-center">
        <div className="flex place-content-between w-full px-4">
            <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold cursor-pointer" onClick={() => window.location.href = "/"}>Gestão de Estoque</h1>
            </div>
            <div className="flex items-center space-x-3">
                <Navigation />
            </div>
            <Avatar />
        </div>
      </div>
    </header>
  );
}
