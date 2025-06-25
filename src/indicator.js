import St from "gi://St";
import Clutter from "gi://Clutter";
import * as Calendar from "resource:///org/gnome/shell/ui/calendar.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

export default class Indicator extends PanelMenu.Button {
  constructor(props) {
    super(props.textSize, props.confettiGicon);
    this._openPrefsCallback = props.openPrefsCallback;
  }

  _init(textSize, confettiGicon) {
    super._init(0.0, _("Next Up Indicator"));

    this._update_size_variables(textSize);
    this._confettiGicon = confettiGicon;
    this._calendarSource = new Calendar.DBusEventSource();

    this._loadGUI();
    this._initialiseMenu();
  }

  _update_size_variables(textSize) {
    this._font_size = textSize;
    this._icon_size = this._font_size + 3;
  }

  _loadGUI() {
    this._menuLayout = new St.BoxLayout({
      vertical: false,
      clip_to_allocation: true,
      x_align: Clutter.ActorAlign.START,
      y_align: Clutter.ActorAlign.CENTER,
      reactive: true,
      x_expand: true,
    });

    this._alarmIcon = new St.Icon({
      icon_name: "alarm-symbolic",
      style_class: "system-status-icon",
      icon_size: this._icon_size,
    });

    this.icon = this._alarmIcon;

    this.text = new St.Label({
      text: "Loading",
      y_expand: true,
      y_align: Clutter.ActorAlign.CENTER,
      style: `font-size: ${this._font_size}px;`,
    });

    this._menuLayout.add_child(this.icon);
    this._menuLayout.add_child(this.text);
    this.add_child(this._menuLayout);

    return;
  }

  _initialiseMenu() {
    const settingsItem = new PopupMenu.PopupMenuItem(_("Settings"));
    settingsItem.connect("activate", () => {
      this._openPrefsCallback();
    });
    this.menu.addMenuItem(settingsItem);
  }

  setText(text) {
    this.text.set_text(text);
  }

  setTextSize(size) {
    this._update_size_variables(size);
    if (this.text) {
      this.text.set_style(`font-size: ${this._font_size}px;`);
    }
    if (this.icon) {
      this.icon.set_icon_size(this._icon_size);
    }
  }

  showAlarmIcon() {
    this.icon.set_icon_name("alarm-symbolic");
  }

  showConfettiIcon() {
    this.icon.set_gicon(this._confettiGicon);
  }

  vfunc_event(event) {
    if (
      event.type() == Clutter.EventType.TOUCH_END ||
      event.type() == Clutter.EventType.BUTTON_RELEASE
    ) {
      if (event.get_button() === Clutter.BUTTON_PRIMARY) {
        // Show calendar on left click
        if (this.menu.isOpen) {
          this.menu._getTopMenu().close();
        } else {
          Main.panel.toggleCalendar();
        }
      } else {
        // Show settings menu on right click
        this.menu.toggle();
      }
    }

    return Clutter.EVENT_PROPAGATE;
  }
}
