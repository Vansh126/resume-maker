import fs from 'fs'
import path from 'path'
import Resume from '../models/resumemodel.js'
import upload from '../middleware/uploadMiddleware.js'
export const uploadResumeimage = async (req, res) => {
    try {
        upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])
            (req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ msg: "file upload failed" })
                }
                const resumeId = req.params.id
                const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })
                if (!resume) {
                    return res.status(404).json({ msg: "resume not found" })

                }
                const uploadsFolder = path.join(process.cwd(), "uploads")
                const baseUrl = `${req.protocol}://${req.get("host")}`;
                const newThumbnail = req.files.thumbnail?.[0]
                const newProfileImage = req.files.newProfileImage?.[0]
                if (newThumbnail) {
                    if (resume.thumbnailLink) {
                        const oldThumbnail = path.join(uploadsFolder.path.basename(resume.thumbnailLink))
                        if (fs.existsSync(oldThumbnail))
                            fs.unlinkSync(oldThumbnail)
                    }
                    resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`
                }
                if (newProfileImage) {
                    if (resume.profileInfo?.profilePreviewUrl) {
                        const oldProfile = path.join(uploadsFolder.path.basename(resume.profileInfo.profilePreviewUrl))
                        if (fs.existsSync(oldProfile))
                            fs.unlinkSync(oldProfile)
                    }
                    resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`
                }

                await resume.save()
                res.status(200).json({
                    msg: "image uploaded successfully",
                    thumbnailLink: resume.thumbnailLink,
                    profilePreviewUrl: resume.profileInfo.profilePreviewUrl
                })

            })

    } catch (err) {
        console.error('error uploading image', err),
            res.status(500).json({
                msg: "failed to upload images",

            })
    }
}