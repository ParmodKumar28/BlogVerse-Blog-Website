// Blog controller to communicate with routes and repository
import ErrorHandler from "../../../utils/ErrorHandler.js";
import { sanitizeRichText, stripHtml } from "../../../utils/sanitize.util.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../model/blog.repository.js";

// Create blog
export const createNewBlog = async (req, res, next) => {
  try {
    const { title, subtitle, content, imageUrl, category, readTime } = req.body;
    const userId = req.user._id; // Extract user ID from auth token middleware

    if (!title || !content || !userId) {
      return next(
        new ErrorHandler(400, "Title and content are required!")
      );
    }

    const newBlog = await createBlog({
      title: stripHtml(title),
      subtitle: stripHtml(subtitle || ""),
      content: sanitizeRichText(content),
      imageUrl: imageUrl || "",
      category: category || "General",
      readTime: readTime || "2 min read",
      user: userId,
    });

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong while creating the blog"));
  }
};

// Get all blogs
export const getAllBlogsHandler = async (req, res, next) => {
  try {
    const blogs = await getAllBlogs();
    res.json(blogs);
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong while fetching blogs"));
  }
};

// Get blog by ID
export const getBlogByIdHandler = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await getBlogById(blogId);

    if (!blog) {
      return next(new ErrorHandler(404, "Blog not found"));
    }

    res.json(blog);
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong while fetching the blog"));
  }
};

// Update blog
export const updateBlogHandler = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    const { title, subtitle, content, imageUrl, category, readTime } = req.body;

    if (!title || !content) {
      return next(new ErrorHandler(400, "Title and content are required!"));
    }

    // Check if the blog exists
    const blog = await getBlogById(blogId);
    if (!blog) {
      return next(new ErrorHandler(404, "Blog not found"));
    }

    // Safely extract author ID whether blog.user is populated object or string ID
    const blogAuthorId = blog.user._id ? blog.user._id.toString() : blog.user.toString();
    if (blogAuthorId !== userId.toString()) {
      return next(new ErrorHandler(403, "Unauthorized to update this blog"));
    }

    // Update blog with validated fields
    const updatedBlog = await updateBlog(blogId, {
      title: stripHtml(title),
      subtitle: stripHtml(subtitle || ""),
      content: sanitizeRichText(content),
      imageUrl: imageUrl || "",
      category: category || "General",
      readTime: readTime || "2 min read",
    });

    res.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    return next(new ErrorHandler(500, "Something went wrong while updating the blog"));
  }
};

// Delete blog
export const deleteBlogHandler = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    // Check if the blog exists
    const blog = await getBlogById(blogId);
    if (!blog) {
      return next(new ErrorHandler(404, "Blog not found"));
    }

    // Safely extract author ID whether blog.user is populated object or string ID
    const blogAuthorId = blog.user._id ? blog.user._id.toString() : blog.user.toString();
    if (blogAuthorId !== userId.toString()) {
      return next(new ErrorHandler(403, "Unauthorized to delete this blog"));
    }

    // Delete the blog
    await deleteBlog(blogId);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
