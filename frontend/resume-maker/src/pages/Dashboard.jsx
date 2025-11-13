import DashboardLayout from '../components/DashboardLayout';
import { dashboardStyles as styles } from '../assets/dummystyle';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LucideFilePlus, LucideTrash2 } from "lucide-react";
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { ResumeSummaryCard } from '../components/Cards';
import toast from 'react-hot-toast';
import moment from 'moment';
import Modal from '../components/Modal';
import CreateResumeForm from '../components/CreateResumeForm';

const Dashboard = () => {
    const navigate = useNavigate();
    const [openCreateModel, setOpenCreateModel] = useState(false);
    const [allResumes, setAllResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumeToDelete, setResumeToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Calculate completion percentage for a resume
    const calculateCompletion = (resume) => {
        let completedFields = 0;
        let totalFields = 0;

        // Profile Info
        totalFields += 3;
        if (resume.profileInfo?.fullName) completedFields++;
        if (resume.profileInfo?.designation) completedFields++;
        if (resume.profileInfo?.summary) completedFields++;

        // Contact Info
        totalFields += 2;
        if (resume.contactInfo?.email) completedFields++;
        if (resume.contactInfo?.phone) completedFields++;

        // Work Experience
        resume.workExperience?.forEach(exp => {
            totalFields += 5;
            if (exp.company) completedFields++;
            if (exp.role) completedFields++;
            if (exp.startDate) completedFields++;
            if (exp.endDate) completedFields++;
            if (exp.description) completedFields++;
        });

        // Education
        resume.education?.forEach(edu => {
            totalFields += 4;
            if (edu.degree) completedFields++;
            if (edu.institution) completedFields++;
            if (edu.startDate) completedFields++;
            if (edu.endDate) completedFields++;
        });

        // Skills
        resume.skills?.forEach(skill => {
            totalFields += 2;
            if (skill.name) completedFields++;
            if (skill.progress > 0) completedFields++;
        });

        // Projects
        resume.projects?.forEach(project => {
            totalFields += 4;
            if (project.title) completedFields++;
            if (project.description) completedFields++;
            if (project.github) completedFields++;
            if (project.liveDemo) completedFields++;
        });

        // Certifications
        resume.certifications?.forEach(cert => {
            totalFields += 3;
            if (cert.title) completedFields++;
            if (cert.issuer) completedFields++;
            if (cert.year) completedFields++;
        });

        // Languages
        resume.languages?.forEach(lang => {
            totalFields += 2;
            if (lang.name) completedFields++;
            if (lang.progress > 0) completedFields++;
        });

        // Interests
        totalFields += (resume.interests?.length || 0);
        completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

        return Math.round((completedFields / totalFields) * 100);
    };

    // Fetch all resumes from API
    const fetchAllResumes = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
            const resumes = response.data.map(resume => ({
                ...resume,
                completion: calculateCompletion(resume)
            }));
            setAllResumes(resumes);
        } catch (error) {
            console.error('Error Fetching Resumes: ', error);
            // Set empty array when error occurs
            setAllResumes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllResumes();
    }, []);

    // Delete resume - Always use mock deletion
    const handleDeleteResume = async () => {
        try {
            if (!resumeToDelete) return;
            
            // Delete resume using API
            await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
            
            // Update local state
            setAllResumes(allResumes.filter(resume => resume._id !== resumeToDelete));
            
            // Show success message
            toast.success('Resume deleted successfully!');
        } catch (error) {
            console.error('Error Deleting The Resume:', error);
            toast.error('Failed to delete resume');
        } finally {
            setResumeToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleDeleteClick = (id) => {
        setResumeToDelete(id);
        setShowDeleteConfirm(true);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.headerWrapper}>
                    <h1 className={styles.headerTitle}>My Resume</h1>
                    <p className={styles.headerSubtitle}>
                        {allResumes.length > 0
                            ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''}`
                            : "Start building your professional resume"}
                    </p>
                </div>

                <div className='flex gap-4 mb-6'>
                    <button className={styles.createButton} onClick={() => setOpenCreateModel(true)}>
                        <div className={styles.createButtonOverlay}></div>
                        <span className={styles.createButtonContent}>
                            Create Now
                            <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={18} />
                        </span>
                    </button>
                </div>

                {loading && (
                    <div className={styles.spinnerWrapper}>
                        <div className={styles.spinner}></div>
                    </div>
                )}

                {!loading && allResumes.length === 0 && (
                    <div className={styles.emptyStateWrapper}>
                        <LucideFilePlus size={32} className='text-violet-600' />
                        <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
                        <p className={styles.emptyText}>
                            You haven't created any resumes yet. Start building your professional resume to land your dream job.
                        </p>
                        <button className={styles.createButton} onClick={() => setOpenCreateModel(true)}>
                            <div className={styles.createButtonOverlay}></div>
                            <span className={styles.createButtonContent}>
                                Create Your First Resume
                                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={20} />
                            </span>
                        </button>
                    </div>
                )}

                {!loading && allResumes.length > 0 && (
                    <div className={styles.grid}>
                        {/* New Resume Card */}
                        <div className={styles.newResumeCard} onClick={() => setOpenCreateModel(true)}>
                            <div className={styles.newResumeIcon}>
                                <LucideFilePlus size={32} className='text-white' />
                            </div>
                            <h3 className={styles.newResumeTitle}>Create New Resume</h3>
                            <p className={styles.newResumeText}>Start Building Your Career</p>
                        </div>

                        {/* Existing resumes */}
                        {allResumes.map((resume) => (
                            <ResumeSummaryCard
                                key={resume._id}
                                imgUrl={resume.thumbnailLink}
                                title={resume.title}
                                createdAt={resume.createdAt}
                                updatedAt={resume.updatedAt}
                                onSelect={() => navigate(`/edit-resume/${resume._id}`)}
                                onDelete={() => handleDeleteClick(resume._id)}
                                completion={resume.completion || 0}
                                isPremium={resume.isPremium}
                                isNew={moment().diff(moment(resume.createdAt), 'days') < 7}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Modal
                isOpen={openCreateModel}
                onClose={() => setOpenCreateModel(false)}
                hideHeader
                maxWidth="max-w-2xl">
                <div className='p-6'>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Create New Resume</h3>
                        <button onClick={() => {
                            setOpenCreateModel(false)
                        }} className={styles.modalCloseButton}>X</button>

                    </div>
                    <CreateResumeForm onSuccess={() => {
                        setOpenCreateModel(false)
                        fetchAllResumes()

                    }}  ></CreateResumeForm>
                </div>
            </Modal>

            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title='Confirm Deletion'
                showActionBtn actionBtnText='Delete' actionBtnClassName='bg-red-600 hover:bg-red-700'
                onActionClick={handleDeleteResume}>
                <div className='p-4'>
                    <div className='flex flex-col items-center text-center'>
                        <div className={styles.deleteIconWrapper}>
                            <LucideTrash2 className='text-orange-600' size={24}>
                                <h3 className={styles.deleteTitle}>Delete Resume?</h3>
                                <p className={styles.deleteText}>Are You Sure You Want To Delete This Resume?This action can't be undone</p>
                            </LucideTrash2>
                        </div>
                    </div>
                </div>
            </Modal>
        </DashboardLayout >
    );
};

export default Dashboard;
