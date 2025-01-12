"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTrash,
  faFilePen,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { Category } from "@/app/_types/Category";
import Link from "next/link";
import Modal from "@/app/_components/Modal";

// カテゴリをフェッチしたときのレスポンスのデータ型
type RawApiCategoryResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// カテゴリの一覧表示のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const requestUrl = "/api/categories";
      const res = await fetch(requestUrl, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setCategories(null);
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const apiResBody = (await res.json()) as RawApiCategoryResponse[];
      setCategories(
        apiResBody.map((body) => ({
          id: body.id,
          name: body.name,
        }))
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリの一覧のフェッチに失敗しました: ${error.message}`
          : `予期せぬエラーが発生しました ${error}`;
      console.error(errorMsg);
      setFetchErrorMsg(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      const requestUrl = `/api/admin/categories/${selectedCategory.id}`;
      const res = await fetch(requestUrl, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      await fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのDELETEリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.size === 0) return;

    setIsSubmitting(true);
    try {
      for (const categoryId of selectedCategories) {
        const requestUrl = `/api/admin/categories/${categoryId}`;
        const res = await fetch(requestUrl, {
          method: "DELETE",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
      }
      await fetchCategories();
      setSelectedCategories(new Set());
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのDELETEリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      const newSelectedCategories = new Set(prevSelectedCategories);
      if (newSelectedCategories.has(categoryId)) {
        newSelectedCategories.delete(categoryId);
      } else {
        newSelectedCategories.add(categoryId);
      }
      return newSelectedCategories;
    });
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!categories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      <div className="text-2xl font-bold">カテゴリの管理</div>

      <div className="mb-3 flex items-end justify-end space-x-2">
        <Link href="/admin/categories/new">
          <button
            type="submit"
            className={twMerge(
              "rounded-md px-2 py-1 font-bold",
              "bg-blue-500 text-white hover:bg-blue-600",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            新規作成
          </button>
        </Link>
        <button
          type="button"
          className={twMerge(
            "rounded-md px-2 py-1 font-bold",
            "bg-red-500 text-white hover:bg-red-600",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          onClick={handleBulkDelete}
          disabled={selectedCategories.size === 0}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          選択済みのカテゴリを削除
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-gray-500">
          （カテゴリは1個も作成されていません）
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={twMerge(
                  "rounded-md border border-slate-400 p-3 shadow-md",
                  "flex items-center justify-between",
                  "font-bold"
                )}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category.id)}
                    onChange={() => toggleCategorySelection(category.id)}
                    className="mr-2 size-5 cursor-pointer appearance-none rounded-full border-2 border-black checked:bg-blue-500"
                  />
                  <Link href={`/admin/categories/${category.id}`}>
                    <span className="mr-4 text-lg font-bold">
                      {category.name}
                    </span>
                  </Link>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/categories/${category.id}`}>
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
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message={`カテゴリ「${selectedCategory?.name}」を本当に削除しますか？`}
      />
    </main>
  );
};

export default Page;
