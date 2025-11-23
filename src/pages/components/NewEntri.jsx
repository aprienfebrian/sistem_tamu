import "../../App.css";
import { useState } from "react";

const NewEntri = () => {
  const [form, setForm] = useState({
    nama: "",
    identitas: "",
    jumlah_tamu: 1,
    institusi: "",
    keperluan: "",
    bertemu: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nama: form.nama,
      identitas: form.identitas,
      jumlah_tamu: Number(form.jumlah_tamu),
      institusi: form.institusi,
      keperluan: form.keperluan,
      bertemu: form.bertemu,
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:4001/entri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      alert("Data berhasil ditambahkan!");
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menambah entri");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Tambah Entri Baru</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Tamu</label>
            <input
              type="text"
              className="form-control"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Identitas</label>
            <input
              type="text"
              className="form-control"
              name="identitas"
              value={form.identitas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jumlah Tamu</label>
            <input
              type="number"
              className="form-control"
              name="jumlah_tamu"
              min="1"
              value={form.jumlah_tamu}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institusi/Perusahaan</label>
            <input
              type="text"
              className="form-control"
              name="institusi"
              value={form.institusi}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Keperluan</label>
            <textarea
              className="form-control"
              name="keperluan"
              value={form.keperluan}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Bertemu Dengan</label>
            <input
              type="text"
              className="form-control"
              name="bertemu"
              value={form.bertemu}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Simpan Entri
          </button>

          <button
            type="reset"
            className="btn btn-secondary"
            onClick={() =>
              setForm({
                nama: "",
                identitas: "",
                jumlah_tamu: 1,
                institusi: "",
                keperluan: "",
                bertemu: "",
              })
            }
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEntri;
