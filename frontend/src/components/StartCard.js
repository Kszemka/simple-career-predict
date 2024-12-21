import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

export default function StartCard({ click, error }) {
  useEffect(() => {
    if (error) {
      notify();
    }
  }, [error]);

  const notify = () => {
    toast.error(`${error}. Odśwież stronę.`, {
      position: "top-right",
      theme: "colored",
    });
  };

  return (
    <>
      <div className="app">
        <div className="container mt-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h1>Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h1>
          <div className="card p-4 mt-5 shadow border border-0" style={{ width: "50rem" }}>
            <div className="card-body">
              <h5 className="pt-2 mb-4">O projekcie</h5>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo quam, eleifend vitae sapien sed, porttitor porta quam. Integer tortor metus, venenatis sit amet ligula ac, interdum
                cursus ante. Cras quis ante eget erat placerat varius a sit amet quam.
              </p>
              <div className="mt-5">
                <button className="btn btn-primary btn-lg" onClick={click} disabled={!!error}>
                  Rozpocznij test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
