"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faTrash,
  faFilePen,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  post: Post;
  reloadAction: () => Promise<void>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onDelete: () => void;
  onToggleSelect: () => void;
  isSelected: boolean;
};

const AdminPostSummary: React.FC<Props> = (props) => {
  const { post, onDelete, onToggleSelect, isSelected } = props;
  const dtFmt = "YYYY-MM-DD";
  const safeHTML = DOMPurify.sanitize(post.content);

  return (
    <div className="rounded-md border border-slate-400 p-3 shadow-md">
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          className="mr-2 size-5 cursor-pointer appearance-none rounded-full border-2 border-black checked:bg-blue-500"
          checked={isSelected}
          onChange={onToggleSelect}
        />
        <div className="flex items-center space-x-1.5">
          {post.categories.map((category) => (
            <div
              key={category.id}
              className={twMerge(
                "rounded-md px-2 py-0.5",
                "text-sm font-bold",
                "border border-slate-400 text-slate-500"
              )}
            >
              <Link href={`/admin/categories/${category.id}`}>
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Link href={`/posts/${post.id}`}>
        <div className="mb-1 flex items-center text-lg font-bold">
          <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
          {post.title}
        </div>
        <div
          className="line-clamp-3"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </Link>
      <div className="flex items-center justify-between space-x-2">
        <div className="text-sm font-bold">
          投稿日：{dayjs(post.createdAt).format(dtFmt)}
        </div>
        <div className="flex space-x-2">
          <Link href={`/admin/posts/${post.id}`}>
            <button
              type="button"
              className={twMerge(
                "rounded-md px-2 py-1 font-bold",
                "bg-indigo-500 text-white hover:bg-indigo-600"
              )}
            >
              <FontAwesomeIcon icon={faFilePen} className="mr-1" />
              編集
            </button>
          </Link>

          <button
            type="button"
            className={twMerge(
              "rounded-md px-2 py-1 font-bold",
              "bg-red-500 text-white hover:bg-red-600"
            )}
            onClick={onDelete}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1" />
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPostSummary;
