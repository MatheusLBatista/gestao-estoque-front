import Navigation from "./navigation";
import Avatar from "./user-menu";

export default function Header() {
  return (
    <header className="h-18 flex items-center justify-between p-4 bg-blue-600 transition-opacity ease-in-out duration-initial backdrop-opacity-100 text-white">
      <div className="w-full flex justify-center">
        <div className="flex place-content-between w-full px-4">
            <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold">Gestão de Estoque</h1>
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
