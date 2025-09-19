import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserMenu() {
  return (
    <div className="flex items-center space-x-3 cursor-pointer">
      <div className="text-right">
        <h5 className="text-sm font-medium text-white mr-1.5">Anna Cors</h5>
      </div>
      <Avatar className="h-10 w-10">
        <AvatarImage src="/avatar.png" alt="User Avatar" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
    </div>
  );
}
