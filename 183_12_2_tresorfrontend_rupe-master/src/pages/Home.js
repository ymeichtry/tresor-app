import '../App.css';
import { Link } from 'react-router-dom';

/**
 * Home
 * @author Peter Rutschmann
 */
const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="hero-title slide-up">Speichern Sie Ihre Daten sicher ab.</h1>
                <p className="hero-subtitle fade-in">Ihr persönlicher Tresor für sensible Informationen</p>
            </div>

            <div className="features-grid">
                <div className="feature-card card">
                    <div className="feature-icon">🔐</div>
                    <h3>Sicher</h3>
                    <p>Verschlüsselte Speicherung Ihrer sensiblen Daten</p>
                </div>

                <div className="feature-card card">
                    <div className="feature-icon">📝</div>
                    <h3>Vielfältig</h3>
                    <p>Verwalten Sie Credentials, Kreditkarten und Notizen</p>
                </div>

                <div className="feature-card card">
                    <div className="feature-icon">🔒</div>
                    <h3>Privat</h3>
                    <p>Nur Sie haben Zugriff auf Ihre Daten</p>
                </div>
            </div>

            <div className="cta-section">
                <h2>Bereit loszulegen?</h2>
                <div className="cta-buttons">
                    <Link to="/user/register" className="button primary">Registrieren</Link>
                    <Link to="/user/login" className="button secondary">Anmelden</Link>
                </div>
            </div>

            <div className="info-section card">
                <h2>Wie es funktioniert</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <p>Registrieren Sie sich für ein Konto</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <p>Melden Sie sich an</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <p>Erstellen Sie neue Secrets</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <p>Verwalten Sie Ihre Daten sicher</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;