import LinksList from "./components/LinksList";
import PhotosAndName from "./components/PhotosAndName";

export default function SidebarDashboard() {
  return (
    <aside className="flex flex-col bg-charcoal-black text-white pt-16 px-9 h-lvh">
      <PhotosAndName />

      <LinksList />
    </aside>
  );
}
