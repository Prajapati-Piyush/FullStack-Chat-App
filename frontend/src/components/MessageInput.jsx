import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB file size limit

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null); // Image or Video
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      toast.error("Please select an image or video file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 20MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      console.log(setMediaPreview)
      setMediaType(file.type.startsWith("image/") ? "image" : "video");
      console.log(mediaType)
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        media: mediaPreview,
        mediaType, // Send the media type (image or video)
      });

      // Clear form
      setText("");
      setMediaPreview(null);
      setMediaType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <video
                src={mediaPreview}
                alt="Video Preview"
                className="w-60 h-60 object-cover rounded-lg border border-zinc-700"
                controls
              />
            )}
            <button
              onClick={removeMedia}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleMediaChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${mediaPreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !mediaPreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
