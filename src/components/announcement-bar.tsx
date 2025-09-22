export function AnnouncementBar({ announcement }: { announcement: string | null }) {
    const displayAnnouncement = announcement || 'Now You Can Download Firmware Free On firmwareflash.com';
  
    return (
      <div className="rainbow-border">
        <div className="rainbow-border-content text-primary-foreground text-center text-sm overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="relative h-8 flex items-center justify-center">
                    <p className="pulse-text-animation">{displayAnnouncement}</p>
                </div>
            </div>
        </div>
      </div>
    );
  }
  