import Resume from "../models/resumemodel.js";
import fs from "fs";
import path from "path";
import multer from "multer";

// ------------------- MULTER SETUP -------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // save files inside uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // unique name
    },
});

const upload = multer({ storage });

// Export middleware for routes
export const uploadResumeImages = upload.array("images", 5); // max 5 images

// ------------------- RESUME CONTROLLERS -------------------
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: "",
                fullName: "",
                designation: "",
                summary: "",
            },
            contactInfo: {
                email: "",
                phone: "",
                location: "",
                linkedin: "",
                github: "",
                website: "",
            },
            workExperience: [
                {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                },
            ],
            education: [
                {
                    degree: "",
                    institution: "",
                    startDate: "",
                    endDate: "",
                },
            ],
            skills: [
                {
                    name: "",
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: "",
                    description: "",
                    github: "",
                    liveDemo: "",
                },
            ],
            certifications: [
                {
                    title: "",
                    issuer: "",
                    year: "",
                },
            ],
            languages: [
                {
                    name: "",
                    progress: "",
                },
            ],
            interests: [""],
        };

        const newResume = await Resume.create({
            userId: "demo-user", // Use a default user ID
            title,
            ...defaultResumeData,
            ...req.body,
        });

        res.status(201).json(newResume);
    } catch (error) {
        console.error("Create Resume Error:", error);
        res.status(500).json({ msg: "failed to create resume", error: error.message });
    }
};

export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().sort({
            updatedAt: -1,
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ msg: "failed to get resume" });
    }
};

export const getResumebyId = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ msg: "resume not found" });
        }
        res.json(resume);
    } catch (error) {
        res.status(404).json({ msg: "resume not found" });
    }
};

export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ msg: "resume not found " });
        }
        Object.assign(resume, req.body);
        const savedResume = await resume.save();
        res.json(savedResume);
    } catch (error) {
        res.status(404).json({ msg: "resume not found " });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ msg: "resume not found " });
        }

        const uploadsFolder = path.join(process.cwd(), "uploads");

        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
                uploadsFolder,
                path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        if (resume.profileInfo?.profileImg) {
            const oldProfile = path.join(
                uploadsFolder,
                path.basename(resume.profileInfo.profileImg)
            );
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        await Resume.findByIdAndDelete(req.params.id);

        res.json({ msg: "resume deleted successfully" });
    } catch (error) {
        res.status(404).json({ msg: "resume not found " });
    }
};

// ------------------- IMAGE UPLOAD HANDLER -------------------
export const saveResumeImages = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ msg: "resume not found" });
        }

        // Save uploaded file paths into profileInfo
        const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
        resume.profileInfo.profileImg = filePaths[0]; // first image as profile
        resume.profileInfo.previewUrl = filePaths[0];
        await resume.save();

        res.json({
            msg: "Images uploaded and resume updated",
            files: filePaths,
            resume,
        });
    } catch (error) {
        res.status(500).json({ msg: "Image upload failed", error: error.message });
    }
};
