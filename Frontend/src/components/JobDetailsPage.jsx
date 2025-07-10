import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Share2 } from "lucide-react";

const JobDetailsPage = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/api/job/${jobId}`);
      console.log("Job data:", res.data);

      setJob(res.data.data.job);
      setCompany(res.data.data.company);
    } catch (err) {
      console.error("Job fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: job?.title || "Job Opportunity",
        text: "Check out this job on our site!",
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error || !job) return <p className="p-4 text-red-600">Job not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      <p className="text-gray-500 mt-1">{job.location.city}, {job.location.state}</p>
      <p className="mt-4">{job.description}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold">Company Details</h2>
      <p className="mt-2"><strong>Name:</strong> {company.name}</p>
      <p><strong>Contact Person:</strong> {company.contactPerson}</p>
      <p><strong>Phone:</strong> {company.phone}</p>
      <p><strong>Referral Source:</strong> {company.referralSource}</p>
    </div>
  );
};

export default JobDetailsPage;
