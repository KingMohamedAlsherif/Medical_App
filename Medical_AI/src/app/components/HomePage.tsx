import React from "react";
import LogoHead from "./LogoHead";
import { IoMdSearch } from "react-icons/io";
import { FaRocketchat } from "react-icons/fa";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

			{/* CCAD Logo */}
			<div className="flex items-start">
				<LogoHead />
			</div>

			{/* Floating Chat Button, reroutes to chat page until i figure out how to make it a floating chat*/}
			<div className="fab pr-10 pb-10">
				<a href="./chat">
  				<button className="btn btn-xl btn-primary rounded-full">
					Chat With Us
				</button>
				</a>
			</div>

			{/* Emergency and Availability Section */}
            <div className="flex items-center gap-2">
			  <img className="w-7 h-7" alt="phone icon" src="../phone.svg" />
              <span className="text-gray-700">EMERGENCY</span>
              <span className="text-blue-600 font-semibold">800 8 2223</span>
            </div>
            <div className="flex items-center gap-2">
			   <img className="w-7 h-7" alt="phone icon" src="../clock.svg" />
              <span className="text-gray-700">WORK HOUR</span>
              <span className="text-blue-600 font-semibold">24/7</span>
            </div>
            <div className="flex items-center gap-2">
			  <img className="w-7 h-7" alt="phone icon" src="../location.svg" />
              <span className="text-gray-700">LOCATION</span>
              <span className="text-blue-600 font-semibold">Abu Dhabi UAE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navibar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">About us</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Doctors</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">News</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
            </div>


			{/* appointment button reroutes to dashboard for easy access*/}
            <div className="flex items-center gap-4">
				<a href="#appt-book">
              <button className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Appointment
              </button>
				</a>
              <button className="text-gray-700">
				<IoMdSearch />
			  </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10 text-center md:text-left">
              <p className="text-blue-600 font-semibold mb-4 tracking-wider text-sm">CARING FOR LIFE</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
                Leading the Way
				<br />
				in Medical Excellence
              </h1>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 text-lg">
                Our Services
              </button>
            </div>
            
            <div className="relative">
              <img 
                src="/landing_pic.png" 
                alt="Medical Team" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>

        {/* */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-900 text-white p-6 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-lg mb-1">Need a specalist? We'll get you the right one!</p>
              </div>
            </div>
			<div className="bg-blue-100 text-blue-900 p-6 rounded-lg flex items-center justify-between">
			  	<div>
                	<p className="text-lg mb-1">Or Book an Appointment!</p>
              		</div> 
            	</div>
          </div>
        </div>
      </section>

      {/* Welcome Section - About */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-wider text-sm">WELCOME TO CLEVELAND</p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">About Cleveland Clinic Abu Dhabi</h2>
          </div>
          
          <div className="max-w-3xl mx-auto text-center text-gray-600 leading-relaxed">
            <p>
              A unique and unprecedented extension of US-based Cleveland Clinic's Model of care,
              Cleveland Clinic Abu Dhabi provides direct access to the world's best specialized
              medical care and international expertise close to home, in a healing environment
              designed for treatment.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-wider text-sm">CARE YOU CAN BELIEVE IN</p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Our Services</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">A Passion for Healing</h3>
                  <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">All our best</h3>
                  <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">5-Star Care</h3>
                  <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Believe in Us</h3>
                  <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Always Caring</h3>
                  <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">A Legacy of Excellence</h3>
                  <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img src="/doc1.png" alt="Doctor 1" className="rounded-lg shadow-md w-full" />
              <img src="/doc2.png" alt="Doctor 2" className="rounded-lg shadow-md w-full" />
              <img src="/doc3.png" alt="Medical Team" className="rounded-lg shadow-md w-full" />
			  <img src="/doc1.png" alt="Doctor 1" className="rounded-lg shadow-md w-full" />
            </div>
          </div>

          {/* convert to group-hover for text and bg
		 	group (div)
			group-hover:text-white 
		  */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="group bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow hover:bg-blue-900">
              <h4 className="font-semibold text-blue-900 group-hover:text-white text-sm">Free Checkup</h4>
            </div>
            <div className="group bg-white p-6 rounded-lg shadow-sm text-center text-white hover:shadow-md transition-shadow hover:bg-blue-900">
              <h4 className="font-semibold text-blue-900 group-hover:text-white text-sm ">Cardiogram</h4>
            </div>
            <div className="group bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow hover:bg-blue-900">
              <h4 className="font-semibold text-blue-900 group-hover:text-white text-sm">Dna Testing</h4>
            </div>
            <div className="group bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow hover:bg-blue-900">
              <h4 className="font-semibold text-blue-900 group-hover:text-white text-sm">Blood Bank</h4>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700">
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-wider text-sm">ALWAYS CARING</p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Our Specialties</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {[
              {name: "Neurology", color: "bg-blue-900" },
              {name: "Bones", color: "bg-blue-900" },
              {name: "Oncology", color: "bg-blue-900" },
              {name: "Otorhinolaryngology", color: "bg-blue-900" },
              {name: "Ophthalmology", color: "bg-white" },
              {name: "Cardiovascular", color: "bg-white" },
              {name: "Pulmonology", color: "bg-white" },
              {name: "Renal Medicine", color: "bg-white" },
              {name: "Gastroenterology", color: "bg-white" },
              {name: "Urology", color: "bg-white" },
              {name: "Dermatology", color: "bg-white" },
              {name: "Gynaecology", color: "bg-white" }
            ].map((specialty, index) => (
              <div 
                key={index}
                className={`${specialty.color} ${specialty.color === 'bg-white' ? 'border border-gray-200' : 'text-white'} p-6 rounded-sm text-center hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <h4 className={`font-semibold text-sm ${specialty.color === 'bg-white' ? 'text-blue-900' : ''}`}>
                  {specialty.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section id="appt-book" className="py-16 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Book an Appointment</h2>
              <p className="text-blue-100 mb-6">
                We're here to make managing your healthcare easier. Please complete the
                form below to receive a callback to schedule your appointment.
              </p>
            </div>

            <form className="space-y-4">
              <input 
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white placeholder-blue-300 border border-blue-700 focus:outline-none focus:border-blue-500"
              />
              <input 
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white placeholder-blue-300 border border-blue-700 focus:outline-none focus:border-blue-500"
              />
              <select className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:border-blue-500">
                <option>Select Department</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
              </select>
              <select className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:border-blue-500">
                <option>Select Doctor</option>
              </select>
              <input 
                type="date"
                className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:border-blue-500"
              />
              <input 
                type="time"
                className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:border-blue-500"
              />
              <textarea 
                placeholder="Message"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white placeholder-blue-300 border border-blue-700 focus:outline-none focus:border-blue-500"
              ></textarea>
              <button 
                type="submit"
                className="w-full bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-wider text-sm">TRUSTED CARE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Our Doctors</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Doctor's Name", specialty: "Neurology", image: "/doc1.png" },
              { name: "Doctor's Name", specialty: "Cardiology", image: "/doc2.png" },
              { name: "Doctor's Name", specialty: "Nephrology", image: "/doc3.png" }
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img src={doctor.image} alt={doctor.name} className="w-full h-80 object-cover" />
                <div className="p-6 text-center">
                  <h3 className="font-bold text-blue-900 text-xl mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 text-sm font-semibold mb-4">{doctor.specialty}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="flex justify-center gap-2">
              <button className="w-3 h-3 bg-blue-600 rounded-full"></button>
              <button className="w-3 h-3 bg-gray-300 rounded-full"></button>
              <button className="w-3 h-3 bg-gray-300 rounded-full"></button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-wider text-sm">BETTER INFORMATION, BETTER HEALTH</p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">News</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-4 bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <img 
                  src="/api/placeholder/120/120" 
                  alt="News" 
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2 hover:text-blue-600 cursor-pointer">
                    This Article's Title goes Here, but not too long.
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 21 Jul, 2021</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="flex justify-center gap-2">
              <button className="w-3 h-3 bg-blue-600 rounded-full"></button>
              <button className="w-3 h-3 bg-gray-300 rounded-full"></button>
              <button className="w-3 h-3 bg-gray-300 rounded-full"></button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Cleveland Clinic Abu Dhabi</h3>
              <p className="text-blue-200 text-sm mb-4">
                Leading the Way in Medical Excellence, Trusted Care.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Important Links</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white">Appointment</a></li>
                <li><a href="#" className="hover:text-white">Doctors</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Call: (+971) 2-123-4567</li>
                <li>Email: noreply@ccad.ae</li>
                <li>Address: Al Maryah Island, Abu Dhabi</li>
                <li>United Arab Emirates, Abu Dhabi</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input 
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 rounded-full bg-blue-800 text-white placeholder-blue-300 text-sm focus:outline-none"
                />
                <button className="bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-500">
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
            <p>© 2015 Cleveland Clinic Abu Dhabi All Rights Reserved by M42</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;