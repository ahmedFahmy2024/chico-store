import React from 'react'
import '../css/page404.css'
import { Link } from 'react-router-dom'
import { LocalContext } from '../context/LocalContext';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';

export default function Page404() {
    const { locale, setLocale } = useContext(LocalContext);
    const { t, i18n } = useTranslation();
    return (
        <section dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "page_404"].join(" ")}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-error">404</h1>


                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    {t("Look like you're lost")}
                                </h3>

                                <p>{t("the page you are looking for not avaible!")}</p>

                                <Link to="/dashboard" className="link_404">{t("Go to Home Page")}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
