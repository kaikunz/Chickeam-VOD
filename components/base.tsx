import SidebarWrapper from './sidebarwrapper';

type BaseProps = {
    children: any; 
};

const Base = async ({ children }: BaseProps) => {
  

  return (
    <>
        <div>
        <SidebarWrapper />
        <main className="py-10 lg:pl-72">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        </div>
    </>
  );
};

export default Base;
