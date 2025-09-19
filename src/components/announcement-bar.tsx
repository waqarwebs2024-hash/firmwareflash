export function AnnouncementBar({ announcement }: { announcement: string | null }) {
    if (!announcement) return null;
  
    return (
      <div className="bg-primary text-primary-foreground text-sm overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative h-8 flex items-center">
            <p className="marquee">{announcement}</p>
          </div>
        </div>
      </div>
    );
  }
  