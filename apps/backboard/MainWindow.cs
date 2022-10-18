using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Backboard.Properties;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace Backboard
{
    
    public partial class MainWindow : Form
    {
        [DllImport("user32")]
        static extern IntPtr GetSystemMenu(IntPtr hWnd, bool bRevert);
        [DllImport("user32")]
        static extern bool EnableMenuItem(IntPtr hMenu, uint uIDEnableItem, uint uEnable);

        const int MF_BYCOMMAND = 0;
        const int MF_DISABLED = 2;
        const int SC_CLOSE = 0xF060;

        private BlueboardClient _client;
        private string url = string.Empty;
        private string key = string.Empty;
        private void LoadSettings()
        {

            this.blueboard_url.Text = this.url = Properties.Settings.Default.URL;
            this.blueboard_key.Text = this.key = Properties.Settings.Default.Token;
        }

        private void ClearSettings()
        {
            Properties.Settings.Default.URL = string.Empty;
            Properties.Settings.Default.Token = string.Empty;
            Properties.Settings.Default.Save();
            LoadSettings();
        }

        private void InitClient()
        {
            if (this.url != string.Empty && this.key != string.Empty)
            {
                this._client = new BlueboardClient(this.url, this.key);
            }
            else
            {
                MessageBox.Show("Hiányos beállítások! Kérjük ellenőrizze az a kulcsot és a szerver címét!", "Backboard",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private void log_info(String message)
        {
            this.output.AppendText(message + "\x0A", Color.Beige);
        }

        private void log_error(String message)
        {
            this.output.AppendText(message + "\x0A", Color.IndianRed);
        }

        private void log_success(String message)
        {
            this.output.AppendText(message + "\x0A", Color.GreenYellow);
        }

        private void log_secondary(String message)
        {
            this.output.AppendText(message + "\x0A", Color.Aqua);
        }

        public MainWindow()
        {
            InitializeComponent();
            log_info("Backboard indítása folyamatban...");
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            log_secondary("Beállítások betöltése...");
            try
            {
                LoadSettings();
                InitClient();
                log_success("Beállítások sikeresen betöltve");
            }
            catch (Exception ex)
            {
                log_error(ex.ToString());
                MessageBox.Show("Hibás beállítások, beállítótár ürítve.", "Backboard", MessageBoxButtons.OK, MessageBoxIcon.Error);
                ClearSettings();
            }

        }

        private void settings_save_Click(object sender, EventArgs e)
        {
            try
            {
                Properties.Settings.Default.URL = this.url = this.blueboard_url.Text;
                Properties.Settings.Default.Token = this.key = this.blueboard_key.Text;
                Properties.Settings.Default.Save();
                InitClient();
                MessageBox.Show("Beállítások sikeresen mentve!", "Backboard", MessageBoxButtons.OK,
                    MessageBoxIcon.Information);
            }
            catch (Exception exception)
            {
                MessageBox.Show("HIBA: " + exception.Message, "Backboard", MessageBoxButtons.OK, MessageBoxIcon.Error);
                log_error(exception.ToString());
            }

        }

        private void output_TextChanged(object sender, EventArgs e)
        {
            output.SelectionStart = output.TextLength;
            output.SelectionLength = 0;
            output.ScrollToCaret();
            // scroll it automatically

        }

        private void file_button_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.InitialDirectory = "c:\\";
                openFileDialog.Filter = "Excel files (*.xlsx)|*.xlsx";
                openFileDialog.FilterIndex = 2;
                openFileDialog.RestoreDirectory = true;

                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    //Get the path of specified file
                    this.filename.Text = openFileDialog.FileName;
                }
            }
        }

        public void SetProgress(int progress)
        {
            this.progressBar1.Value = progress;
        }

        private void start_button_Click(object sender, EventArgs e)
        {
            var sm = GetSystemMenu(Handle, false);
            EnableMenuItem(sm, SC_CLOSE, MF_BYCOMMAND | MF_DISABLED);
            start_button.Enabled = false;
            tab2.Enabled = false;
            file_button.Enabled = false;
            log_info("*Munkásosztag indítása...");
            worker.RunWorkerAsync();
        }

        private void worker_DoWork(object sender, DoWorkEventArgs e)
        {
            BackgroundWorker bg_worker = sender as BackgroundWorker;
            this.Invoke(new Action(() => { progressBar1.Style = ProgressBarStyle.Marquee; }));
            this.BeginInvoke(new Action(() => { log_info("Worker - Tanulók lekérdezése..."); }));
            List<BlueboardUserObject> users = new List<BlueboardUserObject>();
            try
            {
                users = _client.GetUserList();
            }
            catch (Exception ex)
            {
                this.BeginInvoke(new Action(() => { log_error(ex.ToString()); }));
                this.BeginInvoke(new Action(() =>
                {
                    MessageBox.Show("Kapcsolódási hiba! Kérjük ellenőrizze a beállításokat.", "Backboard",
                                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }));

                throw ex;
            }
            this.Invoke(new Action(() => { progressBar1.Style = ProgressBarStyle.Continuous; }));

            List<Dictionary<string, string>> data = new List<Dictionary<string, string>>();

            try
            {
                this.BeginInvoke(new Action(() => { log_success("Worker - Siker! Tanulók száma: " + users.Count); }));
                this.BeginInvoke(new Action(() => { log_info("Worker - Excel tábla beolvasása..."); }));
                ExcelProcessor proc = new ExcelProcessor(this.filename.Text, bg_worker);
                proc.read();
                this.BeginInvoke(new Action(() => { log_success("Worker - Siker!"); }));
                this.BeginInvoke(new Action(() => { log_secondary("Worker - Adatok transzformálása..."); }));
                data = proc.convert();
            }
            catch (Exception ex)
            {
                this.BeginInvoke(new Action(() => { log_error(ex.ToString()); }));
                this.BeginInvoke(new Action(() =>
                {
                    MessageBox.Show("A fájl beolvasása sikertelen.", "Backboard",
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }));

                throw ex;
            }

            try
            {
                this.BeginInvoke(new Action(() => { log_info("Worker - Titkosítás és feltöltés..."); }));
                GradeCollection.ConvertAndSend(data, users, bg_worker, _client);
            }
            catch (Exception ex)
            {
                this.BeginInvoke(new Action(() => { log_error(ex.ToString()); }));
                this.BeginInvoke(new Action(() =>
                {
                    MessageBox.Show("Az adatok feltöltése sikertelen.", "Backboard",
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }));

                throw ex;
            }

            
        }

        private void worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            SetProgress(e.ProgressPercentage);
        }

        private void worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            if (e.Error != null)
            {
                log_error("Worker hiba miatt leállítva.");
            }
            else
            {
                log_success("Worker sikeresen leállítva.");
                MessageBox.Show("Adatok sikeresen feltöltve!", "Backboard", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }

            this.progressBar1.Style = ProgressBarStyle.Continuous;
            var sm = GetSystemMenu(Handle, false);
            EnableMenuItem(sm, SC_CLOSE, MF_BYCOMMAND | 0);
            start_button.Enabled = true;
            tab2.Enabled = true;
            file_button.Enabled = true;
        }
    }
}