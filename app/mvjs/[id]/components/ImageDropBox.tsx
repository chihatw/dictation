'use client';
import { Image, X } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = {
  /** 表示優先の画像URL（previewUrl || imageUrl） */
  displaySrc?: string | null;
  /** ファイル選択・ドロップ時に呼ぶ。第2引数はObjectURL */
  onPickImage: (file: File, previewUrl: string) => void;
  /** UIから完全に消す */
  onClear: () => void;
  /** 空時のARIAラベル */
  emptyAriaLabel?: string;
  /** 読み取り専用や送信中に無効化したい場合 */
  disabled?: boolean;
  /** 追加スタイル */
  className?: string;
};

export function ImageDropBox({
  displaySrc,
  onPickImage,
  onClear,
  emptyAriaLabel = '拖曳或點擊以選擇圖片',
  disabled = false,
  className = '',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const pickFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    onPickImage(f, url);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFiles(e.target.files);
    // 同じファイル選択の再検知用
    e.currentTarget.value = '';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={[
        'w-full h-32 rounded-lg my-2 border-2 border-dashed flex justify-center items-center overflow-hidden relative',
        displaySrc
          ? 'border-slate-200 bg-white'
          : 'border-slate-300 bg-slate-50',
        isDragOver ? 'ring-2 ring-slate-400 ring-offset-1 ring-inset' : '',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      onClick={() => !displaySrc && !disabled && pickFile()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role='button'
      aria-label={displaySrc ? '已選擇圖片' : emptyAriaLabel}
      tabIndex={0}
    >
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onChange}
        disabled={disabled}
      />

      {displaySrc ? (
        <>
          <img
            src={displaySrc}
            alt='選擇的圖片預覽'
            className='h-full w-full object-contain'
          />
          <button
            type='button'
            onClick={onClear}
            className='absolute right-1.5 top-1.5 inline-flex items-center justify-center rounded-full bg-black/70 p-1 text-white hover:bg-black/80'
            aria-label='刪除圖片'
            disabled={disabled}
          >
            <X className='h-4 w-4' />
          </button>
        </>
      ) : (
        <div className='flex gap-2 items-center text-slate-400 text-sm pointer-events-none'>
          <Image className='h-4 w-4' />
          <div>請將圖片拖曳到這裡 或點擊以選擇圖片</div>
        </div>
      )}
    </div>
  );
}
export default ImageDropBox;
