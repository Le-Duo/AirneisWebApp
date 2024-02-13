import { Helmet } from 'react-helmet-async'

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - Tableau de Bord</title>
      </Helmet>
      <div>
        <h2>Tableau de Bord</h2>
        <div>
          <h3>Ventes Totales par Jour</h3>
          <div>Placeholder pour l'histogramme des ventes</div>
        </div>
        <div>
          <h3>Paniers Moyens par Catégorie</h3>
          <div>
            Placeholder pour l'histogramme multi-couches des paniers moyens
          </div>
        </div>
        <div>
          <h3>Volume de Vente par Catégorie</h3>
          <div>
            Placeholder pour le graphique camembert des ventes par catégorie
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
