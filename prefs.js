"use strict";

import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class NextUpExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = this.getSettings();

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: "Panel to show indicator in" });
    group.add(row);

    const dropdown = new Gtk.DropDown({
      model: Gtk.StringList.new(["Left", "Center", "Right"]),
      valign: Gtk.Align.CENTER,
    });

    settings.bind(
      "which-panel",
      dropdown,
      "selected",
      Gio.SettingsBindFlags.DEFAULT
    );

    row.add_suffix(dropdown);
    row.activatable_widget = dropdown;

    // Create a new preferences row for text size
    const textSizeRow = new Adw.ActionRow({ title: "Event text size" });
    group.add(textSizeRow);

    const textSizeSpin = new Gtk.SpinButton({
      adjustment: new Gtk.Adjustment({
        lower: 5,
        upper: 50,
        step_increment: 1,
        page_increment: 5,
        value: settings.get_int("text-size"),
      }),
      valign: Gtk.Align.CENTER,
    });

    settings.bind(
      "text-size",
      textSizeSpin,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    textSizeRow.add_suffix(textSizeSpin);
    textSizeRow.activatable_widget = textSizeSpin;

    // Add our page to the window
    window.add(page);
  }
}
