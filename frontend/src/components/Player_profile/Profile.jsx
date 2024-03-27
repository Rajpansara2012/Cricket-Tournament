import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [graph_run, setGraph_run] = useState(null);
  const [graph_strike_rate, setGraph_strike_rate] = useState(null);
  const [graph_wicket, setGraph_wicket] = useState(null);
  const [graph_economy, setGraph_economy] = useState(null);


  useEffect(() => {
    const userfind = Cookies.get("token");
    const usertype = Cookies.get("user_type");
    if (userfind === undefined) {
      navigate("/Login");
    } else if (usertype !== "admin") {
      navigate("/Profile");
    }


    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8082/user/profile",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setProfile(response.data.profile);
        setUser(response.data.user);
        setGraph_run(response.data.graph_run);
        setGraph_strike_rate(response.data.graph_strike_rate);
        setGraph_wicket(response.data.graph_wicket);
        setGraph_economy(response.data.graph_economy);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);
  console.log(user);
  const data_run = {
    labels: graph_run ? graph_run.map((_, index) => index + 1) : [],
    datasets: [
      {
        label: "Runs",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: graph_run,
      },
    ],
  };


  const config_run = {
    type: "line",
    data: data_run,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 200,
          stepSize: 10,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Runs Over Time",
        },
      },
    },
  };
  const data_strike_rate = {
    labels: graph_strike_rate
      ? graph_strike_rate.map((_, index) => index + 1)
      : [],
    datasets: [
      {
        label: "Strike Rate",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: graph_strike_rate,
      },
    ],
  };


  const config_strike_rate = {
    type: "line",
    data: data_strike_rate,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 200,
          stepSize: 10,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Runs Over Time",
        },
      },
    },
  };
  const data_wicket = {
    labels: graph_wicket ? graph_wicket.map((_, index) => index + 1) : [],
    datasets: [
      {
        label: "Wicket",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: graph_wicket,
      },
    ],
  };


  const config_wicket = {
    type: "line",
    data: data_wicket,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 200,
          stepSize: 10,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Wickets Over Time",
        },
      },
    },
  };
  const data_economy = {
    labels: graph_economy ? graph_economy.map((_, index) => index + 1) : [],
    datasets: [
      {
        label: "Economy",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: graph_economy,
      },
    ],
  };


  const config_economy = {
    type: "line",
    data: data_economy,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 200,
          stepSize: 10,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Economy Over Time",
        },
      },
    },
  };
  console.log(profile);
  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          {/* Card with Image */}
          <MDBCol lg="3">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBCardImage
                  src= {Cookies.get('profile_img')}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "140px", height: "143px", margin: "auto" }}
                  fluid
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>


          {/* Card with User Information */}
          <MDBCol lg="9">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {profile && profile[0].name}
                      {!profile && user && user.username}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {user && user.email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Role</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {profile && profile[0].type}
                      {!profile && "-"}

                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>


          <MDBCol lg="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Runs</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {profile && profile[0].profile.run}
                      {!profile && "-"}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Strike Rate</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {profile && profile[0].profile.strike_rate}
                      {!profile && "-"}

                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Wicket</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {profile && profile[0].profile.wicket}
                      {!profile && "-"}

                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow className="align-items-center">
                  {/* User Information */}
                  <MDBCol sm="3">
                    <MDBCardText>Economy</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {profile && profile[0].profile.economy.toFixed(2)}
                      {!profile && "-"}

                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>


        <MDBRow style={{ marginBottom: '20px' }}>
          <MDBCol lg="6">
            <MDBCard>
              <MDBCardBody>
                <Line data={data_run} options={config_run} />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>


          <MDBCol lg="6">
            <MDBCard>
              <MDBCardBody>
                <Line data={data_strike_rate} options={config_strike_rate} />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>


        <MDBRow>
          <MDBCol lg="6">
            <MDBCard>
              <MDBCardBody>
                <Line data={data_wicket} options={config_wicket} />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>


          <MDBCol lg="6">
            <MDBCard>
              <MDBCardBody>
                <Line data={data_economy} options={config_economy} />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
