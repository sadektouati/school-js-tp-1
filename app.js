'use strict'

window.onload = function () {

    //un objet contenant les données nécessaire pour valider: 'nom', 'prenom', 'telephone', 'codePostal', 'presentation'
    const validationRegexp = {
        "nom": {
            "regexp": /^[\p{Letter}]+(['\s\-][\p{Letter}]+)*$/u, "message": 'Un ou plusieurs mots alphabétiques séparés par un éspace, un tiret ou une apostrophe.'
        },
        "prenom": {
            "regexp": /^[\p{Letter}]+(['\s\-][\p{Letter}]+)*$/u, "message": 'Un ou plusieurs mots alphabétiques séparés par un éspace, un tiret ou une apostrophe.'
        },
        "telephone": {
            "regexp": /^\d\d\d \d\d\d-\d\d\d\d*$/, "message": 'format "xxx xxx-xxxx" où les x sont des chiffres.'
        },
        "codePostal": {
            "regexp": /^(?![DFIOQUWZ])[A-Z]\d(?![DFIOQU])[A-Z]\s\d(?![DFIOQU])[A-Z]\d$/i, "message": 'Sous la forme A1B 2C3, lettres D,F,I,O,Q,U non permises, ainsi que W et Z en première position (en plus des autres lettres non autorisées).'
        },
        "presentation": {
            "regexp": /^\S+(\s+\S+){4,}$/, "message": 'Présentation, au moins 5 mots.'
        },

    }

    //un objet contenant les données nécessaire pour valider: 'anneeConstruction', 'superficie', 'nbPieces'
    const validationInterval = {
        "anneeConstruction": {
            "min": 1800, "max": new Date().getFullYear(), "message": 'Entre 1800 et l\'année en cours.'
        },
        "superficie": {
            "min": 100, "max": 9999, "message": "Superficie entre 100 et 9999 pi2."
        },
        "nbPieces": {
            "min": 1, "max": 20, "message": "De 1 à 20 pièces."
        },
    }

    //erreur status et contacts
    const validationBouttons = {
        "checkbox": {
            "containeurErreurID": "#errContacts", "erreur": "Choisissez au moins un contact.",
        },
        "radio": {
            "containeurErreurID": "#errTitre", "erreur": "Choisissez un titre.",
        }
    }


    let controles = document.querySelectorAll("input, select, textarea");

    controles.forEach(function (element) {
        element.addEventListener('change', function () {
            verifierElement(element)
        })
    });

    document.querySelector("button[name=envoi]").addEventListener("click", function (clickEvent) {
        controles.forEach(function (element) {
            verifierElement(element)
        })

        if (document.querySelectorAll("span[id^=err]:empty").length !== document.querySelectorAll("span[id^=err]").length) {
            clickEvent.preventDefault()
        }
    });



    //valider l'element et afficher un message d'erreur dans l'element désigné. elle prend en parametre le noeud qui reçoit l'evenement change ou un element dans la boucle apres click sur le bouton envoi.
    function verifierElement(ceNoeud) {
        let valeurCeNoeud = ceNoeud.value
        let nomCeNoeud = ceNoeud.name;
        let erreur = "";
        let containeurErreur = ceNoeud.nextElementSibling

        if (valeurCeNoeud.length === 0) {

            const textLabel = ceNoeud.previousElementSibling.innerText.trim();
            if (textLabel == "") {
                erreur = "Champ obligatoire";
            } else {
                erreur = textLabel.replace(' :', '') + " est obligatoire"
            }

        } else {

            if (["radio", "checkbox"].indexOf(ceNoeud.type) >= 0) {

                containeurErreur = document.querySelector(validationBouttons[ceNoeud.type]["containeurErreurID"])

                //verifie si au moins un input de ce type est cliqué
                if (document.querySelectorAll("input[type=" + ceNoeud.type + "]:checked").length === 0) {
                    erreur = validationBouttons[ceNoeud.type].erreur;
                }

                //si l'element en question est: nom, prenom, telephone, codePostal ou presentation
            } else if (['nom', 'prenom', 'telephone', 'codePostal', 'presentation'].indexOf(nomCeNoeud) >= 0) {

                if (validationRegexp[nomCeNoeud].regexp.test(valeurCeNoeud) == false) erreur = validationRegexp[nomCeNoeud].message;

                //si l'element en question est: anneeConstruction, superficie ou nbPieces
            } else if (['anneeConstruction', 'superficie', 'nbPieces'].indexOf(nomCeNoeud) >= 0) {

                if (!/^\d+$/.test(valeurCeNoeud)) {
                    erreur = "des chiffres seulement svp";
                } else {
                    const intVal = parseInt(valeurCeNoeud)
                    if (!(intVal && intVal >= validationInterval[nomCeNoeud].min && intVal <= validationInterval[nomCeNoeud].max)) erreur = validationInterval[nomCeNoeud].message;
                }

            }

        }

        //afichage d'erreur
        containeurErreur.innerText = erreur;
    }

}