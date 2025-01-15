import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

export default function StartCard({ click, error }) {
  useEffect(() => {
    if (error) {
      toast.error(`${error}. Odśwież stronę.`, {
        position: "top-right",
        theme: "colored",
      });
    }
  }, [error]);

  return (
    <>
      <div className="app">
        <div className="container mt-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h2 style={{ width: "50rem" }}>Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h2>
          <div className="card p-4 mt-5 shadow border border-0" style={{ width: "50rem" }}>
            <div className="card-body mx-auto" style={{ width: "85%" }}>
              <div>
                <p className="mb-0">Projekt zaliczeniowy z przedmiotu</p>
                <p>
                  <strong>Inteligentne Systemy Wspomagania Decyzji</strong>
                </p>
              </div>
              <div className="mt-5">
                <button className="btn btn-primary btn-lg" onClick={click} disabled={!!error}>
                  Rozpocznij test
                </button>
              </div>
              <button className="btn btn-outline-success pt-2 mt-4 mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#aboutProject">
                O projekcie
              </button>
              <div className="collapse" id="aboutProject">
                <p>
                  W dzisiejszym dynamicznie zmieniającym się rynku pracy, wiele osób napotyka trudności w wyborze ścieżki zawodowej zgodnej z ich osobowością, umiejętnościami i aspiracjami. Problem
                  ten jest szczególnie widoczny w przypadku młodych ludzi wchodzących na rynek pracy lub osób planujących zmianę zawodu.
                </p>
                <p>
                  Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości to narzędzie, które może pomóc użytkownikom w wyborze kariery zawodowej,
                  uwzględniając ich cechy osobowości, umiejętności, zainteresowania i preferencje.
                </p>
                <p>
                  Opracowany system wspiera podejmowanie decyzji poprzez analizę wyników testu osobowości opartych na modelu OCEAN. Jest to popularny model znany również jako Wielka Piątka cech
                  osobowości. Jest on szeroko stosowanym w psychologii frameworkiem do opisu charakteru człowieka. Aplikacja indetyfikuje kluczowe cechy osobowości użytkownika, takie jak otwartość na
                  doświadczenia, sumienność, ekstrawersja, ugodowość oraz neurotyczność, a następnie proponował najbardziej odpowiednie zawody zgodne z tym profilem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
