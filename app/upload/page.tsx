import Header from '@/components/header';
import VideoUploadForm from './upload-form';

export default async function UploadPage() {


  return (
    <>
      <Header />

      <section className='min-h-screen pt-20'>
        <div className='container mx-auto px-6 py-12 h-full flex justify-center items-center'>
          <div className='md:w-8/12 lg:w-5/12 bg-white px-8 py-10'>
            <VideoUploadForm />
          </div>
        </div>
      </section>
    </>
  );
}