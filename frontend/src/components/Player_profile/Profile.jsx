import React, { useEffect, useState } from 'react';
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
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';


export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userfind = Cookies.get('token');
    const usertype = Cookies.get('user_type');
    if (userfind === undefined) {
        navigate("/Login")
    } else if (usertype !== 'admin') {
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
            setUser(response.data.user)
          } catch (error) {
            console.log(error);
          }
        };
        fetchProfile();
      },[]);
      
      console.log(profile)
      return (
        <section style={{ backgroundColor: '#eee' }}>
          <MDBContainer className="py-5">
            
            <MDBRow>
    
              {/* Card with Image */}
              <MDBCol lg="3">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBCardImage
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: '140px', height: '143px', margin: 'auto' }}
                      fluid
                    />
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
    
              {/* Card with User Information */}
              <MDBCol lg="8">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Name</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{profile && profile[0].name}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Email</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{user && user.email}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Role</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{profile && profile[0].type}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol lg="11">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Runs</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{profile && profile[0].profile.run}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Strike Rate</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{profile && profile[0].profile.strike_rate}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Wicket</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{profile && profile[0].profile.wicket}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow className="align-items-center">
                      {/* User Information */}
                      <MDBCol sm="3">
                        <MDBCardText>Economy</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{profile && profile[0].profile.economy.toFixed(2)}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      );
    }