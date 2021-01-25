// Classes and functions

de.elo.client.scripting.components.Toolbar = function () {
    /// <summary><para>Überschrift: Toolbar </para>
    /// <para></para>
    /// <para>  Beschreibung: Anpassbare Toolbar für einen neuen Funktionsbereich. Es können mehrere Buttons hinzugefügt werden. </para>
    /// <para></para>
    /// <para>  Copyright: Copyright (c) ELO Digital Office GmbH 2011-2012 </para>
    /// <para></para>
    /// <para></para>
    /// <para></para>
    /// <para>@author Dirk Hennig</para>
    /// <para>@version $Revision: 1.4 $</para>
    /// <para>@since 8.01.000</para></summary>
};

de.elo.client.scripting.components.Toolbar.prototype =
{
    addButton: function (x, text, eventName) {
        /// <param name="x" type="Number"><para>int x X-Position im Raster (Spalte), Zählung beginnt hier bei 1</para></param>
        /// <param name="text" type="java.lang.String">java.lang.String text Text-Label des Buttons</param>
        /// <param name="eventName" type="java.lang.String"><para>java.lang.String eventName Ein Scripting-Event, das aufgerufen wird, wenn der Button gedrückt wird</para></param>
        /// <summary><para>Erzeugt einen Button und fügt ihn an der angegebenen Stelle in die Toolbar ein.</para>
        /// <para></para>
        /// <para>@return Das erzeugte Button-Objekt</para>
        /// <para>@since 8.01.000</para></summary>
        /// <returns type="de.elo.client.scripting.dialog.Button"><para>Das erzeugte Button-Objekt</para></returns>
    }
};
