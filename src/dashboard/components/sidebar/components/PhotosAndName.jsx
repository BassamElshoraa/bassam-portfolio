export default function PhotosAndName() {
  return (
    <div className="flex flex-col gap-2">
      <img
        src={"/image/personal/bassam-elshoraa-portrait-2026.png"}
        alt="photo"
        loading="lazy"
        width={140}
        height={140}
        className="ring-1 ring-yellow-crayola rounded-full"
      />

      <h3>Bassam El-Shoraa</h3>
    </div>
  );
}
