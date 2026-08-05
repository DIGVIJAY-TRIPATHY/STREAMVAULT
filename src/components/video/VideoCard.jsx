import { Link } from "react-router-dom";

import Avatar from "../common/Avatar";
import { formatRelativeDate, formatDuration, formatCount } from "../../utils/formatDate";
import { getMediaUrl } from "../../utils/media";

function VideoCard({ video }) {
  if (!video) return null;

  const {
    _id,
    thumbnail,
    title,
    duration,
    views,
    createdAt,
    owner,
  } = video;

  const thumbnailUrl = getMediaUrl(thumbnail);

  return (
    <Link to={`/watch/${_id}`} className="group block w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {Boolean(duration) && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        <Avatar
          src={owner?.avatar}
          alt={owner?.username || owner?.fullName || "Channel"}
          size="sm"
        />

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>

          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {owner?.fullName || owner?.username}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatCount(views)} views · {formatRelativeDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
